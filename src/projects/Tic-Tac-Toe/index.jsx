import { RotateCcw } from "lucide-react";
import { useState } from "react";

export function TicTacToe() {
  const turns = { x: "X", o: "O" };
  const initialState = new Array(9).fill("");
  const [playArea, setPlayArea] = useState(initialState);
  const [nextTurn, setNextTurn] = useState(turns.x);
  const [winner, setWinner] = useState("");
  const [isDraw, setIsDraw] = useState(false);

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWin = board => wins.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);

  const handleClick = (index) => {
    if (playArea[index] !== "" || winner || isDraw) return;

    const current = nextTurn;
    const newBoard = [...playArea];
    newBoard[index] = current;
    setPlayArea(newBoard);
    setNextTurn(current === turns.x ? turns.o : turns.x);

    if (checkWin(newBoard)) {
      setWinner(current);
    } else if (newBoard.every(cell => cell !== "")) {
      setIsDraw(true);
    }
  };

  const handleReset = () => {
    setPlayArea(initialState);
    setWinner("");
    setNextTurn(turns.x);
    setIsDraw(false);
  };

  const statusText = isDraw ? "Draw game" : winner ? `Winner: ${winner}` : `Next turn: ${nextTurn}`;
  const statusTone = isDraw ? "text-[#ffd166]" : winner ? "text-[#4de8cb]" : "text-[#9fb0ff]";

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
          <p className={`mt-3 text-lg font-medium ${statusTone}`}>{statusText}</p>
        </div>

        <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-3 sm:gap-4">
          {playArea.map((square, index) => (
            <button
              className="group m-0 aspect-square w-full p-0 rounded-2xl border border-[#2f3f85] bg-[#0f1843] text-4xl font-semibold leading-none text-[#ecf0ff] shadow-[0_8px_20px_rgba(0,0,0,0.32)] transition-all duration-200 hover:border-[#ff329d88] hover:bg-[#16215a] disabled:cursor-not-allowed disabled:opacity-90"
              onClick={() => handleClick(index)}
              disabled={winner || isDraw || square !== ""}
              key={index}
            >
              <span className={square === "X" ? "text-[#ff5ab0]" : "text-[#4de8cb]"}>{square || "·"}</span>
            </button>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-[#ff329d66] bg-[#ff329d22] px-4 py-2 font-medium text-[#ffd5eb] transition-colors hover:bg-[#ff329d33]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Game
          </button>
        </div>
      </section>
    </main>
  );
}
