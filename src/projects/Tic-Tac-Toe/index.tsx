import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createRoom,
  getState,
  heartbeat,
  joinRoom,
  makeMove,
  requestRematch,
  subscribeRoom,
  type Mark,
  type RoomSnapshot,
  type Seat,
} from "./online-service";

type Mode = "local" | "online";

const ONLINE_SESSION_KEY = "ttt_online_session";

type OnlineSession = {
  roomId: string;
  roomCode: string;
  playerToken: string;
  seat: Seat;
  expiresAt: string;
};

const LOCAL_TURNS = { x: "X", o: "O" } as const;
const EMPTY_BOARD: Mark[] = ["", "", "", "", "", "", "", "", ""];

const WIN_LINES: Array<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWin = (board: Mark[]): boolean =>
  WIN_LINES.some(([a, b, c]) => board[a] !== "" && board[a] === board[b] && board[a] === board[c]);

const formatMs = (ms: number): string => {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const readStoredSession = (): OnlineSession | null => {
  try {
    const raw = localStorage.getItem(ONLINE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnlineSession;
    if (
      typeof parsed.roomId !== "string" ||
      typeof parsed.roomCode !== "string" ||
      typeof parsed.playerToken !== "string" ||
      (parsed.seat !== "X" && parsed.seat !== "O") ||
      typeof parsed.expiresAt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const saveSession = (session: OnlineSession) => {
  localStorage.setItem(ONLINE_SESSION_KEY, JSON.stringify(session));
};

const clearStoredSession = () => {
  localStorage.removeItem(ONLINE_SESSION_KEY);
};

const sanitizeName = (value: string): string => value.trim().slice(0, 16);
const sanitizeCode = (value: string): string => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

const moveErrorReason = (reason: string): string => {
  switch (reason) {
    case "not_your_turn":
      return "It is not your turn.";
    case "occupied":
      return "That cell is already occupied.";
    case "expired":
      return "Room expired. Create a new room.";
    case "ended":
      return "Game already ended.";
    case "invalid":
      return "Invalid move.";
    default:
      return "Move rejected.";
  }
};

const getConnectionTone = (state: "live" | "reconnecting" | "disconnected"): string => {
  if (state === "live") return "text-[#4de8cb]";
  if (state === "reconnecting") return "text-[#ffd166]";
  return "text-[#ff8fab]";
};

const GameBoard = ({
  board,
  disabled,
  onCellClick,
}: {
  board: Mark[];
  disabled: boolean;
  onCellClick: (index: number) => void;
}) => (
  <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-3 sm:gap-4">
    {board.map((square, index) => (
      <button
        className="group m-0 aspect-square w-full rounded-2xl border border-[#2f3f85] bg-[#0f1843] p-0 text-4xl font-semibold leading-none text-[#ecf0ff] shadow-[0_8px_20px_rgba(0,0,0,0.32)] transition-all duration-200 hover:border-[#ff329d88] hover:bg-[#16215a] disabled:cursor-not-allowed disabled:opacity-90"
        onClick={() => onCellClick(index)}
        disabled={disabled || square !== ""}
        key={index}
      >
        <span className={square === "X" ? "text-[#ff5ab0]" : "text-[#4de8cb]"}>{square || "."}</span>
      </button>
    ))}
  </div>
);

const LocalGame = () => {
  const [playArea, setPlayArea] = useState<Mark[]>(EMPTY_BOARD);
  const [nextTurn, setNextTurn] = useState<Mark>(LOCAL_TURNS.x);
  const [winner, setWinner] = useState<Mark>("");
  const [isDraw, setIsDraw] = useState(false);

  const handleClick = (index: number) => {
    if (playArea[index] !== "" || winner || isDraw) return;

    const current = nextTurn;
    const newBoard = [...playArea];
    newBoard[index] = current;
    setPlayArea(newBoard);
    setNextTurn(current === LOCAL_TURNS.x ? LOCAL_TURNS.o : LOCAL_TURNS.x);

    if (checkWin(newBoard)) {
      setWinner(current);
    } else if (newBoard.every(cell => cell !== "")) {
      setIsDraw(true);
    }
  };

  const handleReset = () => {
    setPlayArea(EMPTY_BOARD);
    setWinner("");
    setNextTurn(LOCAL_TURNS.x);
    setIsDraw(false);
  };

  const statusText = isDraw ? "Draw game" : winner ? `Winner: ${winner}` : `Next turn: ${nextTurn}`;
  const statusTone = isDraw ? "text-[#ffd166]" : winner ? "text-[#4de8cb]" : "text-[#9fb0ff]";

  return (
    <>
      <div className="mb-6 text-center">
        <p className={`mt-3 text-lg font-medium ${statusTone}`}>{statusText}</p>
      </div>

      <GameBoard board={playArea} disabled={Boolean(winner) || isDraw} onCellClick={handleClick} />

      <div className="mt-7 flex justify-center">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ff329d66] bg-[#ff329d22] px-4 py-2 font-medium text-[#ffd5eb] transition-colors hover:bg-[#ff329d33]"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Game
        </button>
      </div>
    </>
  );
};

const OnlineGame = () => {
  const [displayName, setDisplayName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [session, setSession] = useState<OnlineSession | null>(null);
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [movePending, setMovePending] = useState<number | null>(null);
  const [connectionState, setConnectionState] = useState<"live" | "reconnecting" | "disconnected">("disconnected");
  const [now, setNow] = useState(Date.now());

  const expiresAtMs = useMemo(() => {
    const value = session?.expiresAt ?? snapshot?.expiresAt;
    if (!value) return null;
    const ms = new Date(value).getTime();
    return Number.isFinite(ms) ? ms : null;
  }, [session?.expiresAt, snapshot?.expiresAt]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const restored = readStoredSession();
    if (!restored) return;
    if (new Date(restored.expiresAt).getTime() <= Date.now()) {
      clearStoredSession();
      return;
    }
    setSession(restored);
  }, []);

  useEffect(() => {
    if (!session) {
      setSnapshot(null);
      setConnectionState("disconnected");
      return;
    }

    let active = true;
    setConnectionState("reconnecting");

    const syncState = async () => {
      try {
        const next = await getState(session.roomId, session.playerToken);
        if (!active) return;
        setSnapshot(next);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to sync room state.");
      }
    };

    void syncState();

    const heartbeatTimer = window.setInterval(() => {
      void heartbeat(session.roomId, session.playerToken).catch(() => {
        if (!active) return;
        setConnectionState("reconnecting");
      });
    }, 15000);

    const unsubscribe = subscribeRoom(session.roomId, () => void syncState(), setConnectionState);

    return () => {
      active = false;
      window.clearInterval(heartbeatTimer);
      void unsubscribe();
    };
  }, [session]);

  const resetOnlineState = () => {
    setSession(null);
    setSnapshot(null);
    setError("");
    setJoinCode("");
    setConnectionState("disconnected");
    clearStoredSession();
  };

  const roomExpired = useMemo(() => {
    if (snapshot?.status === "expired") return true;
    if (!expiresAtMs) return false;
    return now >= expiresAtMs;
  }, [snapshot?.status, expiresAtMs, now]);

  const timeLeft = expiresAtMs ? formatMs(expiresAtMs - now) : "--:--";

  const handleCreateRoom = async () => {
    const name = sanitizeName(displayName);
    if (!name) {
      setError("Enter a display name (1-16 chars).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created = await createRoom(name);
      const nextSession: OnlineSession = {
        roomId: created.snapshot.roomId,
        roomCode: created.snapshot.code,
        playerToken: created.playerToken,
        seat: created.seat,
        expiresAt: created.snapshot.expiresAt,
      };
      setSession(nextSession);
      setSnapshot(created.snapshot);
      saveSession(nextSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create room.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    const name = sanitizeName(displayName);
    const code = sanitizeCode(joinCode);
    if (!name) {
      setError("Enter a display name (1-16 chars).");
      return;
    }
    if (code.length !== 6) {
      setError("Room code must be 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const joined = await joinRoom(code, name);
      const nextSession: OnlineSession = {
        roomId: joined.snapshot.roomId,
        roomCode: joined.snapshot.code,
        playerToken: joined.playerToken,
        seat: joined.seat,
        expiresAt: joined.snapshot.expiresAt,
      };
      setSession(nextSession);
      setSnapshot(joined.snapshot);
      saveSession(nextSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join room.");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number) => {
    if (!session || !snapshot || roomExpired) return;
    if (snapshot.status !== "active") return;
    if (snapshot.winner || snapshot.isDraw) return;
    if (snapshot.nextTurn !== session.seat) return;
    if (snapshot.board[index] !== "") return;

    setMovePending(index);
    setError("");

    try {
      const result = await makeMove(session.roomId, session.playerToken, index);
      setSnapshot(result.snapshot);
      if (!result.accepted) {
        setError(moveErrorReason(result.reason));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to play move.");
    } finally {
      setMovePending(null);
    }
  };

  const handleRematch = async () => {
    if (!session || roomExpired) return;
    setLoading(true);
    setError("");
    try {
      const next = await requestRematch(session.roomId, session.playerToken);
      setSnapshot(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request rematch.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.roomCode);
      setError("");
    } catch {
      setError("Unable to copy room code.");
    }
  };

  const statusLine = (() => {
    if (!session) return "Create or join a room to start online play.";
    if (!snapshot) return "Syncing room state...";
    if (roomExpired) return "Room expired. Create or join a new room.";
    if (snapshot.status === "waiting") {
      return session.seat === "X" ? "Waiting for opponent to join..." : "Waiting for host to start...";
    }
    if (snapshot.winner) return snapshot.winner === session.seat ? "You won." : "You lost.";
    if (snapshot.isDraw) return "Draw game.";
    return snapshot.nextTurn === session.seat ? "Your turn." : "Opponent turn.";
  })();

  const statusTone = (() => {
    if (!session || !snapshot) return "text-[#9fb0ff]";
    if (roomExpired) return "text-[#ff8fab]";
    if (snapshot.winner) return snapshot.winner === session.seat ? "text-[#4de8cb]" : "text-[#ff8fab]";
    if (snapshot.isDraw) return "text-[#ffd166]";
    return snapshot.nextTurn === session.seat ? "text-[#4de8cb]" : "text-[#9fb0ff]";
  })();

  const opponentDisconnected = useMemo(() => {
    if (!session || !snapshot?.opponentLastSeenAt) return false;
    const seen = new Date(snapshot.opponentLastSeenAt).getTime();
    if (!Number.isFinite(seen)) return false;
    return Date.now() - seen > 30000;
  }, [session, snapshot?.opponentLastSeenAt, now]);

  if (!session) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#2e3668] bg-[#0f1843] p-4">
          <label className="mb-2 block text-sm font-medium text-[#cfd6ff]">Display name</label>
          <input
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            maxLength={16}
            placeholder="Player name"
            className="w-full rounded-xl border border-[#2f3f85] bg-[#0b1130] px-3 py-2 text-sm text-[#ecf0ff] outline-none focus:border-[#4de8cb]"
          />
          <p className="mt-2 text-xs text-[#9fb0ff]">No sign-in required. Name is room-local only.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="rounded-xl border border-[#35d4ba66] bg-[#35d4ba22] px-4 py-2 font-medium text-[#d8fff8] transition-colors hover:bg-[#35d4ba33] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>

          <div className="rounded-xl border border-[#2f3f85] bg-[#0f1843] p-2">
            <input
              value={joinCode}
              onChange={event => setJoinCode(sanitizeCode(event.target.value))}
              maxLength={6}
              placeholder="Room code"
              className="mb-2 w-full rounded-lg border border-[#2f3f85] bg-[#0b1130] px-3 py-2 text-center font-mono text-sm uppercase tracking-[0.16em] text-[#ecf0ff] outline-none focus:border-[#4de8cb]"
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className="w-full rounded-lg border border-[#ff329d66] bg-[#ff329d22] px-3 py-2 text-sm font-medium text-[#ffd5eb] transition-colors hover:bg-[#ff329d33] disabled:opacity-60"
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </div>

        {error && <p className="rounded-xl border border-[#ff8fab55] bg-[#ff8fab1f] px-3 py-2 text-sm text-[#ffd4df]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-[#2e3668] bg-[#0f1843] p-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9fb0ff]">Room</p>
          <p className="mt-1 text-xl font-semibold text-[#ffffff]">{session.roomCode}</p>
          <button onClick={copyCode} className="mt-2 text-xs text-[#4de8cb] underline underline-offset-4">
            Copy code
          </button>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9fb0ff]">You are</p>
          <p className="mt-1 text-xl font-semibold text-[#ffffff]">{session.seat}</p>
          <p className={`mt-2 text-xs font-medium ${getConnectionTone(connectionState)}`}>
            Connection: {connectionState === "live" ? "Live" : connectionState === "reconnecting" ? "Reconnecting" : "Disconnected"}
          </p>
        </div>
        <p className="text-xs text-[#9fb0ff]">Room expires in {timeLeft}</p>
      </div>

      <p className={`text-center text-lg font-medium ${statusTone}`}>{statusLine}</p>
      {opponentDisconnected && (
        <p className="rounded-xl border border-[#ffd16655] bg-[#ffd1661c] px-3 py-2 text-sm text-[#ffe4a2]">
          Opponent may be disconnected.
        </p>
      )}
      {error && <p className="rounded-xl border border-[#ff8fab55] bg-[#ff8fab1f] px-3 py-2 text-sm text-[#ffd4df]">{error}</p>}

      <GameBoard
        board={snapshot?.board ?? EMPTY_BOARD}
        disabled={
          !snapshot ||
          roomExpired ||
          snapshot.status !== "active" ||
          snapshot.nextTurn !== session.seat ||
          Boolean(snapshot.winner) ||
          snapshot.isDraw ||
          movePending !== null
        }
        onCellClick={handleMove}
      />

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleRematch}
          disabled={loading || roomExpired || !snapshot}
          className="inline-flex items-center gap-2 rounded-xl border border-[#35d4ba66] bg-[#35d4ba22] px-4 py-2 font-medium text-[#d8fff8] transition-colors hover:bg-[#35d4ba33] disabled:opacity-60"
        >
          <RotateCcw className="h-4 w-4" />
          Rematch
        </button>
        <button
          onClick={resetOnlineState}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ff329d66] bg-[#ff329d22] px-4 py-2 font-medium text-[#ffd5eb] transition-colors hover:bg-[#ff329d33]"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export function TicTacToe() {
  const [mode, setMode] = useState<Mode>("local");

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#060816] px-4 py-12 text-[#c3c9ff] sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(244,63,181,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070a1b_0%,#060816_45%,#060816_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:linear-gradient(rgba(59,73,160,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,73,160,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#2e3668] bg-[#0b1130d9] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur sm:p-8">
        <div className="mb-6 text-center">
          <p className="inline-flex rounded-full border border-[#35d4ba66] bg-[#35d4ba22] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4de8cb]">
            Mini Project
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#ffffff] drop-shadow-[0_0_18px_rgba(148,163,255,0.24)] sm:text-5xl">
            Tic-Tac-Toe
          </h1>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl border border-[#2f3f85] bg-[#0f1843] p-1">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "local" ? "bg-[#35d4ba33] text-[#d8fff8]" : "text-[#9fb0ff] hover:text-[#ecf0ff]"
              }`}
              onClick={() => setMode("local")}
            >
              Local
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "online" ? "bg-[#ff329d33] text-[#ffd5eb]" : "text-[#9fb0ff] hover:text-[#ecf0ff]"
              }`}
              onClick={() => setMode("online")}
            >
              Online
            </button>
          </div>
        </div>

        {mode === "local" ? <LocalGame /> : <OnlineGame />}
      </section>
    </main>
  );
}
