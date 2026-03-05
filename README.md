# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Tic-Tac-Toe Online Mode (Supabase)

The Tic-Tac-Toe mini project now includes `Local` and `Online` modes.

### 1) Configure environment variables

Add these to your environment (or `.env.local`):

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2) Apply database migration

Run the SQL file in your Supabase SQL editor:

`supabase/migrations/20260305_ttt_online.sql`

This creates:
- `ttt_rooms`
- `ttt_room_players`
- `ttt_moves`
- RPC functions used by the frontend (`ttt_create_room`, `ttt_join_room`, `ttt_get_state`, `ttt_make_move`, `ttt_heartbeat`, `ttt_request_rematch`)

### 3) Install dependency

```bash
bun install
```
