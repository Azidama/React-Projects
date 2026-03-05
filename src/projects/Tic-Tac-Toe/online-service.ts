import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

export type Mark = "" | "X" | "O";
export type Seat = "X" | "O";
export type RoomStatus = "waiting" | "active" | "ended" | "expired";

export interface RoomSnapshot {
  roomId: string;
  code: string;
  board: Mark[];
  nextTurn: Seat;
  winner: Seat | null;
  isDraw: boolean;
  status: RoomStatus;
  version: number;
  expiresAt: string;
  updatedAt: string;
  opponentLastSeenAt?: string | null;
}

type RpcCreateRoomRow = {
  room_id: string;
  room_code: string;
  seat: Seat;
  player_token: string;
  expires_at: string;
};

type RpcJoinRoomRow = {
  room_id: string;
  seat: Seat;
  player_token: string;
  snapshot: unknown;
};

type RpcMoveRow = {
  accepted: boolean;
  reason: string;
  snapshot: unknown;
};

const asArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);

const parseBoard = (input: unknown): Mark[] => {
  if (!Array.isArray(input) || input.length !== 9) {
    return ["", "", "", "", "", "", "", "", ""];
  }
  return input.map(cell => (cell === "X" || cell === "O" ? cell : "")) as Mark[];
};

const normalizeSnapshot = (input: unknown): RoomSnapshot => {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid room snapshot payload.");
  }

  const raw = input as Record<string, unknown>;
  const status = raw.status;
  const nextTurn = raw.nextTurn;
  const winner = raw.winner;

  if (typeof raw.roomId !== "string" || typeof raw.code !== "string" || typeof raw.expiresAt !== "string") {
    throw new Error("Snapshot payload missing room metadata.");
  }
  if (status !== "waiting" && status !== "active" && status !== "ended" && status !== "expired") {
    throw new Error("Snapshot payload has invalid room status.");
  }
  if (nextTurn !== "X" && nextTurn !== "O") {
    throw new Error("Snapshot payload has invalid turn.");
  }
  if (winner !== null && winner !== "X" && winner !== "O") {
    throw new Error("Snapshot payload has invalid winner.");
  }

  return {
    roomId: raw.roomId,
    code: raw.code,
    board: parseBoard(raw.board),
    nextTurn,
    winner,
    isDraw: Boolean(raw.isDraw),
    status,
    version: typeof raw.version === "number" ? raw.version : 0,
    expiresAt: raw.expiresAt,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : raw.expiresAt,
    opponentLastSeenAt:
      typeof raw.opponentLastSeenAt === "string" || raw.opponentLastSeenAt === null ? raw.opponentLastSeenAt : null,
  };
};

const rpcErrorMessage = (error: { message?: string } | null, fallback: string): string => {
  if (!error?.message) return fallback;
  return error.message;
};

export const createRoom = async (
  displayName: string
): Promise<{ snapshot: RoomSnapshot; playerToken: string; seat: Seat }> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("ttt_create_room", { display_name: displayName });
  if (error) {
    throw new Error(rpcErrorMessage(error, "Unable to create room."));
  }

  const row = asArray(data as RpcCreateRoomRow[])[0];
  if (!row) {
    throw new Error("Room creation returned no data.");
  }

  const snapshot = await getState(row.room_id, row.player_token);
  return { snapshot, playerToken: row.player_token, seat: row.seat };
};

export const joinRoom = async (
  roomCode: string,
  displayName: string
): Promise<{ snapshot: RoomSnapshot; playerToken: string; seat: Seat }> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("ttt_join_room", { room_code: roomCode, display_name: displayName });
  if (error) {
    throw new Error(rpcErrorMessage(error, "Unable to join room."));
  }

  const row = asArray(data as RpcJoinRoomRow[])[0];
  if (!row) {
    throw new Error("Join room returned no data.");
  }

  return {
    snapshot: normalizeSnapshot(row.snapshot),
    playerToken: row.player_token,
    seat: row.seat,
  };
};

export const getState = async (roomId: string, playerToken: string): Promise<RoomSnapshot> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("ttt_get_state", { room_id: roomId, player_token: playerToken });
  if (error) {
    throw new Error(rpcErrorMessage(error, "Unable to fetch room state."));
  }
  return normalizeSnapshot(data);
};

export const makeMove = async (
  roomId: string,
  playerToken: string,
  cell: number
): Promise<{ accepted: boolean; reason: string; snapshot: RoomSnapshot }> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("ttt_make_move", { room_id: roomId, player_token: playerToken, cell });
  if (error) {
    throw new Error(rpcErrorMessage(error, "Unable to submit move."));
  }

  const row = asArray(data as RpcMoveRow[])[0];
  if (!row) {
    throw new Error("Make move returned no data.");
  }

  return {
    accepted: row.accepted,
    reason: row.reason,
    snapshot: normalizeSnapshot(row.snapshot),
  };
};

export const heartbeat = async (roomId: string, playerToken: string): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.rpc("ttt_heartbeat", { p_room_id: roomId, p_player_token: playerToken });
  if (error) {
    throw new Error(rpcErrorMessage(error, "Unable to send heartbeat."));
  }
};

export const requestRematch = async (roomId: string, playerToken: string): Promise<RoomSnapshot> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("ttt_request_rematch", {
    p_room_id: roomId,
    p_player_token: playerToken,
  });
  if (error) {
    throw new Error(rpcErrorMessage(error, "Unable to request rematch."));
  }
  return normalizeSnapshot(data);
};

const mapChannelState = (status: RealtimeChannelStatus): "live" | "reconnecting" | "disconnected" => {
  if (status === "SUBSCRIBED") return "live";
  if (status === "CHANNEL_ERROR" || status === "CLOSED" || status === "TIMED_OUT") {
    return "disconnected";
  }
  return "reconnecting";
};

export const subscribeRoom = (
  roomId: string,
  onChange: () => void,
  onConnectionState?: (state: "live" | "reconnecting" | "disconnected") => void
): (() => Promise<"ok" | "timed out" | "error">) => {
  const supabase = getSupabaseClient();
  const channelName = `ttt-room-${roomId}-${Math.random().toString(36).slice(2, 8)}`;

  const channel: RealtimeChannel = supabase
    .channel(channelName)
    .on("postgres_changes", { event: "*", schema: "public", table: "ttt_rooms", filter: `id=eq.${roomId}` }, () => {
      onChange();
    })
    .subscribe((status: RealtimeChannelStatus) => {
      onConnectionState?.(mapChannelState(status));
    });

  return () => supabase.removeChannel(channel);
};

type RealtimeChannelStatus = "SUBSCRIBED" | "TIMED_OUT" | "CLOSED" | "CHANNEL_ERROR" | "JOINING" | "LEAVING";
