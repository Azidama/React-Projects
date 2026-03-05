create extension if not exists pgcrypto;

create table if not exists public.ttt_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null check (status in ('waiting', 'active', 'ended', 'expired')),
  board text[] not null default array['','','','','','','','',''],
  next_turn text not null check (next_turn in ('X', 'O')) default 'X',
  winner text null check (winner in ('X', 'O')),
  is_draw boolean not null default false,
  move_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  version integer not null default 0,
  constraint ttt_rooms_board_len check (array_length(board, 1) = 9)
);

create table if not exists public.ttt_room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.ttt_rooms(id) on delete cascade,
  seat text not null check (seat in ('X', 'O')),
  display_name text not null,
  token_hash text not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (room_id, seat)
);

create table if not exists public.ttt_moves (
  id bigserial primary key,
  room_id uuid not null references public.ttt_rooms(id) on delete cascade,
  move_no integer not null,
  seat text not null check (seat in ('X', 'O')),
  cell integer not null check (cell between 0 and 8),
  created_at timestamptz not null default now(),
  unique (room_id, move_no)
);

create index if not exists ttt_rooms_code_idx on public.ttt_rooms(code);
create index if not exists ttt_rooms_expires_at_idx on public.ttt_rooms(expires_at);
create index if not exists ttt_room_players_room_id_idx on public.ttt_room_players(room_id);
create index if not exists ttt_moves_room_id_move_no_idx on public.ttt_moves(room_id, move_no);

create or replace function public.ttt_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ttt_rooms_set_updated_at on public.ttt_rooms;
create trigger ttt_rooms_set_updated_at
before update on public.ttt_rooms
for each row
execute function public.ttt_set_updated_at();

create or replace function public.ttt_hash_token(input text)
returns text
language sql
immutable
as $$
  select encode(digest(input, 'sha256'), 'hex');
$$;

create or replace function public.ttt_generate_code()
returns text
language plpgsql
as $$
declare
  chars constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  idx integer;
begin
  for i in 1..6 loop
    idx := 1 + floor(random() * length(chars))::int;
    code := code || substr(chars, idx, 1);
  end loop;
  return code;
end;
$$;

create or replace function public.ttt_calc_winner(board text[])
returns text
language plpgsql
immutable
as $$
begin
  if board[1] <> '' and board[1] = board[2] and board[2] = board[3] then return board[1]; end if;
  if board[4] <> '' and board[4] = board[5] and board[5] = board[6] then return board[4]; end if;
  if board[7] <> '' and board[7] = board[8] and board[8] = board[9] then return board[7]; end if;
  if board[1] <> '' and board[1] = board[4] and board[4] = board[7] then return board[1]; end if;
  if board[2] <> '' and board[2] = board[5] and board[5] = board[8] then return board[2]; end if;
  if board[3] <> '' and board[3] = board[6] and board[6] = board[9] then return board[3]; end if;
  if board[1] <> '' and board[1] = board[5] and board[5] = board[9] then return board[1]; end if;
  if board[3] <> '' and board[3] = board[5] and board[5] = board[7] then return board[3]; end if;
  return null;
end;
$$;

create or replace function public.ttt_room_snapshot(p_room_id uuid, p_viewer_seat text)
returns jsonb
language plpgsql
stable
as $$
declare
  r public.ttt_rooms%rowtype;
  opponent_seen timestamptz;
begin
  select * into r from public.ttt_rooms where id = p_room_id;
  if not found then
    raise exception 'Room not found';
  end if;

  select max(last_seen_at)
    into opponent_seen
    from public.ttt_room_players
   where room_id = p_room_id
     and seat <> p_viewer_seat;

  return jsonb_build_object(
    'roomId', r.id,
    'code', r.code,
    'board', to_jsonb(r.board),
    'nextTurn', r.next_turn,
    'winner', r.winner,
    'isDraw', r.is_draw,
    'status', r.status,
    'version', r.version,
    'expiresAt', r.expires_at,
    'updatedAt', r.updated_at,
    'opponentLastSeenAt', opponent_seen
  );
end;
$$;

create or replace function public.ttt_assert_player(p_room_id uuid, p_player_token text)
returns text
language plpgsql
stable
as $$
declare
  player_seat text;
begin
  select seat
    into player_seat
    from public.ttt_room_players
   where room_id = p_room_id
     and token_hash = public.ttt_hash_token(p_player_token)
   limit 1;

  if player_seat is null then
    raise exception 'Unauthorized player token';
  end if;

  return player_seat;
end;
$$;

create or replace function public.ttt_create_room(display_name text)
returns table (
  room_id uuid,
  room_code text,
  seat text,
  player_token text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  room_row public.ttt_rooms%rowtype;
  generated_token text;
  generated_code text;
begin
  if display_name is null or char_length(trim(display_name)) = 0 or char_length(trim(display_name)) > 16 then
    raise exception 'Display name must be between 1 and 16 characters.';
  end if;

  loop
    generated_code := public.ttt_generate_code();
    exit when not exists (select 1 from public.ttt_rooms where code = generated_code);
  end loop;

  insert into public.ttt_rooms (code, status, expires_at)
  values (generated_code, 'waiting', now() + interval '20 minutes')
  returning * into room_row;

  generated_token := encode(gen_random_bytes(24), 'hex');

  insert into public.ttt_room_players (room_id, seat, display_name, token_hash)
  values (room_row.id, 'X', trim(display_name), public.ttt_hash_token(generated_token));

  return query
  select room_row.id, room_row.code, 'X'::text, generated_token, room_row.expires_at;
end;
$$;

create or replace function public.ttt_join_room(room_code text, display_name text)
returns table (
  room_id uuid,
  seat text,
  player_token text,
  snapshot jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  room_row public.ttt_rooms%rowtype;
  generated_token text;
begin
  if display_name is null or char_length(trim(display_name)) = 0 or char_length(trim(display_name)) > 16 then
    raise exception 'Display name must be between 1 and 16 characters.';
  end if;

  select *
    into room_row
    from public.ttt_rooms
   where code = upper(trim(room_code))
   for update;

  if not found then
    raise exception 'Room not found.';
  end if;

  if room_row.expires_at <= now() then
    update public.ttt_rooms set status = 'expired' where id = room_row.id;
    raise exception 'Room expired.';
  end if;

  if room_row.status <> 'waiting' then
    raise exception 'Room is not joinable.';
  end if;

  if exists (select 1 from public.ttt_room_players where room_id = room_row.id and seat = 'O') then
    raise exception 'Room is full.';
  end if;

  generated_token := encode(gen_random_bytes(24), 'hex');

  insert into public.ttt_room_players (room_id, seat, display_name, token_hash)
  values (room_row.id, 'O', trim(display_name), public.ttt_hash_token(generated_token));

  update public.ttt_rooms
     set status = 'active',
         version = version + 1
   where id = room_row.id;

  return query
  select
    room_row.id,
    'O'::text,
    generated_token,
    public.ttt_room_snapshot(room_row.id, 'O');
end;
$$;

create or replace function public.ttt_get_state(room_id uuid, player_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_seat text;
begin
  viewer_seat := public.ttt_assert_player(room_id, player_token);

  update public.ttt_rooms
     set status = 'expired'
   where id = room_id
     and expires_at <= now()
     and status <> 'expired';

  return public.ttt_room_snapshot(room_id, viewer_seat);
end;
$$;

create or replace function public.ttt_make_move(room_id uuid, player_token text, cell integer)
returns table (
  accepted boolean,
  reason text,
  snapshot jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  room_row public.ttt_rooms%rowtype;
  player_seat text;
  next_board text[];
  next_winner text;
  next_is_draw boolean;
  next_status text;
  next_turn text;
  next_move_count integer;
begin
  if cell < 0 or cell > 8 then
    return query select false, 'invalid'::text, public.ttt_get_state(room_id, player_token);
    return;
  end if;

  player_seat := public.ttt_assert_player(room_id, player_token);

  select * into room_row from public.ttt_rooms where id = room_id for update;
  if not found then
    return query select false, 'invalid'::text, null::jsonb;
    return;
  end if;

  if room_row.expires_at <= now() then
    update public.ttt_rooms set status = 'expired' where id = room_row.id;
    return query select false, 'expired'::text, public.ttt_room_snapshot(room_row.id, player_seat);
    return;
  end if;

  if room_row.status = 'ended' or room_row.status = 'expired' or room_row.winner is not null or room_row.is_draw then
    return query select false, 'ended'::text, public.ttt_room_snapshot(room_row.id, player_seat);
    return;
  end if;

  if room_row.status <> 'active' then
    return query select false, 'invalid'::text, public.ttt_room_snapshot(room_row.id, player_seat);
    return;
  end if;

  if room_row.next_turn <> player_seat then
    return query select false, 'not_your_turn'::text, public.ttt_room_snapshot(room_row.id, player_seat);
    return;
  end if;

  if room_row.board[cell + 1] <> '' then
    return query select false, 'occupied'::text, public.ttt_room_snapshot(room_row.id, player_seat);
    return;
  end if;

  next_board := room_row.board;
  next_board[cell + 1] := player_seat;
  next_winner := public.ttt_calc_winner(next_board);
  next_is_draw := next_winner is null and not ('' = any(next_board));
  next_status := case when next_winner is not null or next_is_draw then 'ended' else 'active' end;
  next_turn := case when player_seat = 'X' then 'O' else 'X' end;
  next_move_count := room_row.move_count + 1;

  update public.ttt_rooms
     set board = next_board,
         next_turn = case when next_status = 'ended' then room_row.next_turn else next_turn end,
         winner = next_winner,
         is_draw = next_is_draw,
         status = next_status,
         move_count = next_move_count,
         version = room_row.version + 1
   where id = room_row.id;

  insert into public.ttt_moves (room_id, move_no, seat, cell)
  values (room_row.id, next_move_count, player_seat, cell);

  return query select true, 'ok'::text, public.ttt_room_snapshot(room_row.id, player_seat);
end;
$$;

create or replace function public.ttt_heartbeat(p_room_id uuid, p_player_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  player_seat text;
begin
  player_seat := public.ttt_assert_player(p_room_id, p_player_token);

  update public.ttt_rooms
     set status = 'expired'
   where id = p_room_id
     and expires_at <= now()
     and status <> 'expired';

  update public.ttt_room_players
     set last_seen_at = now()
   where room_id = p_room_id
     and seat = player_seat;

  return true;
end;
$$;

create or replace function public.ttt_request_rematch(p_room_id uuid, p_player_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  player_seat text;
  player_count integer;
begin
  player_seat := public.ttt_assert_player(p_room_id, p_player_token);

  update public.ttt_rooms
     set status = 'expired'
   where id = p_room_id
     and expires_at <= now()
     and status <> 'expired';

  if exists (select 1 from public.ttt_rooms where id = p_room_id and status = 'expired') then
    return public.ttt_room_snapshot(p_room_id, player_seat);
  end if;

  select count(*)
    into player_count
    from public.ttt_room_players
   where room_id = p_room_id;

  if player_count < 2 then
    return public.ttt_room_snapshot(p_room_id, player_seat);
  end if;

  delete from public.ttt_moves where room_id = p_room_id;

  update public.ttt_rooms
     set board = array['','','','','','','','',''],
         next_turn = 'X',
         winner = null,
         is_draw = false,
         status = 'active',
         move_count = 0,
         version = version + 1
   where id = p_room_id;

  return public.ttt_room_snapshot(p_room_id, player_seat);
end;
$$;

alter table public.ttt_rooms disable row level security;
alter table public.ttt_room_players disable row level security;
alter table public.ttt_moves disable row level security;

grant execute on function public.ttt_create_room(text) to anon, authenticated;
grant execute on function public.ttt_join_room(text, text) to anon, authenticated;
grant execute on function public.ttt_get_state(uuid, text) to anon, authenticated;
grant execute on function public.ttt_make_move(uuid, text, integer) to anon, authenticated;
grant execute on function public.ttt_heartbeat(uuid, text) to anon, authenticated;
grant execute on function public.ttt_request_rematch(uuid, text) to anon, authenticated;

do $$
begin
  begin
    alter publication supabase_realtime add table public.ttt_rooms;
  exception
    when duplicate_object then null;
  end;
end;
$$;

-- Optional cleanup jobs (run with pg_cron if enabled):
-- select cron.schedule('ttt-expire-rooms', '* * * * *',
--   $$update public.ttt_rooms set status = 'expired' where expires_at < now() and status <> 'expired';$$);
-- select cron.schedule('ttt-prune-old-rooms', '0 3 * * *',
--   $$delete from public.ttt_rooms where status = 'expired' and expires_at < now() - interval '24 hours';$$);
