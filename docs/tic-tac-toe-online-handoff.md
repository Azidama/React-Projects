# Tic-Tac-Toe Online Multiplayer Handoff

## Overview
Implemented a no-sign-in online multiplayer mode for the Tic-Tac-Toe mini project using Supabase Realtime + Postgres RPC functions, while keeping the original local mode.

The app now supports:
- `Local` mode (existing behavior)
- `Online` mode (room codes, two players, server-authoritative moves, reconnect, rematch, room expiration)

Room expiration is set to **20 minutes**.

## Files Added/Updated

### Added
- `src/lib/supabase.ts`
  - Central Supabase client initialization.
  - Reads env vars:
    - `VITE_SUPABASE_URL` (fallback: `SUPABASE_URL`)
    - `VITE_SUPABASE_ANON_KEY` (fallback: `SUPABASE_ANON_KEY`)

- `src/projects/Tic-Tac-Toe/online-service.ts`
  - Typed frontend service layer for multiplayer:
    - `createRoom`
    - `joinRoom`
    - `getState`
    - `makeMove`
    - `heartbeat`
    - `requestRematch`
    - `subscribeRoom`
  - Includes snapshot normalization and connection state mapping.

- `supabase/migrations/20260305_ttt_online.sql`
  - Full DB schema + RPC function setup.
  - Realtime publication hook for `ttt_rooms`.

### Updated
- `src/projects/Tic-Tac-Toe/index.tsx`
  - Refactored into `Local` + `Online` mode UI.
  - Added lobby flow: create/join room.
  - Added session restore via `localStorage` key:
    - `ttt_online_session`
  - Added connection state, expiry countdown, rematch/leave controls.

- `package.json` / `bun.lock`
  - Added dependency: `@supabase/supabase-js`.

- `README.md`
  - Added setup section for online mode.

## Database Design (Supabase)

### Tables
- `ttt_rooms`
  - Room code, board, turn, winner/draw, status, expiry, version.
- `ttt_room_players`
  - Seat (`X`/`O`), display name, token hash, `last_seen_at`.
- `ttt_moves`
  - Move log (`move_no`, `seat`, `cell`).

### RPC Functions
- `ttt_create_room(display_name text)`
- `ttt_join_room(room_code text, display_name text)`
- `ttt_get_state(room_id uuid, player_token text)`
- `ttt_make_move(room_id uuid, player_token text, cell integer)`
- `ttt_heartbeat(p_room_id uuid, p_player_token text)`
- `ttt_request_rematch(p_room_id uuid, p_player_token text)`

### Server-side game authority
Win/draw/turn validity is computed in SQL RPC (`ttt_make_move`) with row locking, so client state is not authoritative.

## Frontend Flow Summary

### Online lobby
1. Enter display name (1-16 chars).
2. Create room or join with 6-character code.
3. Session token/seat is saved to local storage.

### Online game
- Board is rendered from server snapshot.
- Realtime subscription listens to room row changes.
- On change, client refetches canonical snapshot.
- Heartbeat updates presence every 15 seconds.
- Move requests are RPC calls; invalid reasons are surfaced in UI.

### Reconnect
- On mount, stored session is restored if unexpired.
- If restore fails (invalid/expired token/room), session is cleared.

## Required Setup

1. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Apply migration in Supabase SQL editor:
   - `supabase/migrations/20260305_ttt_online.sql`

3. Install deps:
   - `bun install`

4. Run app:
   - `bun dev`

## Quick Manual Test Checklist

1. Open app in two browsers/devices.
2. Browser A: create room, copy code.
3. Browser B: join with code.
4. Play full game, verify winner/draw sync.
5. Refresh one browser, verify reconnect and state restore.
6. Click rematch, verify board reset.
7. Leave room, verify local session cleanup.

## Known Issues / Notes

- `bun x tsc --noEmit` still reports pre-existing strict TypeScript errors in `build.ts` unrelated to Tic-Tac-Toe multiplayer.
- SQL currently uses `security definer` RPC functions and disabled RLS on these three tables for simplicity.
  - Recommended follow-up: tighten security by enabling RLS and exposing only required operations through audited RPC paths/rules.

## Suggested Next Improvements

1. Add server-side rate limiting/throttling per token/IP.
2. Harden input validation and error codes for join/create.
3. Add observability (basic logging/metrics) for RPC failure reasons.
4. Add optional “opponent left” semantics if heartbeat stale for prolonged period.
