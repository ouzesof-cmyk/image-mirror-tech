
-- Roles enum + table
create type public.app_role as enum ('admin','client','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path=public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Profiles
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "profiles self upsert" on public.profiles for insert to authenticated
  with check (user_id = auth.uid());
create policy "profiles self update" on public.profiles for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (user_id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Page visits (public insert)
create table public.page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  visitor_id text,
  created_at timestamptz not null default now()
);
grant select on public.page_visits to authenticated;
grant insert on public.page_visits to anon, authenticated;
grant all on public.page_visits to service_role;
alter table public.page_visits enable row level security;
create policy "anyone insert visits" on public.page_visits for insert to anon, authenticated with check (true);
create policy "admins read visits" on public.page_visits for select to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- Contact messages (public insert)
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service text,
  brief text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone submit contact" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admins read contact" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update contact" on public.contact_messages for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete contact" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- Client projects
create table public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text,
  current_stage text not null default 'discovery',
  progress int not null default 0,
  stages text[] not null default array['discovery','design','development','review','delivered'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.client_projects to authenticated;
grant all on public.client_projects to service_role;
alter table public.client_projects enable row level security;
create policy "clients read own projects" on public.client_projects for select to authenticated
  using (client_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage projects" on public.client_projects for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Project messages
create table public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null default 'client',
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.project_messages to authenticated;
grant all on public.project_messages to service_role;
alter table public.project_messages enable row level security;
create policy "thread participants read" on public.project_messages for select to authenticated
  using (client_id = auth.uid() or sender_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "participants send" on public.project_messages for insert to authenticated
  with check (sender_id = auth.uid() and (client_id = auth.uid() or public.has_role(auth.uid(),'admin')));
create policy "participants update read" on public.project_messages for update to authenticated
  using (client_id = auth.uid() or public.has_role(auth.uid(),'admin'));
alter publication supabase_realtime add table public.project_messages;

-- Call sessions
create table public.call_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  room_url text not null,
  room_name text not null,
  created_by uuid references auth.users(id),
  status text not null default 'active',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.call_sessions to authenticated;
grant all on public.call_sessions to service_role;
alter table public.call_sessions enable row level security;
create policy "client or admin read calls" on public.call_sessions for select to authenticated
  using (client_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage calls" on public.call_sessions for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
alter publication supabase_realtime add table public.call_sessions;

-- Zoom settings (single row id=1)
create table public.zoom_settings (
  id int primary key,
  zoom_link text,
  meeting_id text,
  passcode text,
  instructions text,
  updated_at timestamptz not null default now()
);
insert into public.zoom_settings (id) values (1);
grant select on public.zoom_settings to anon, authenticated;
grant update on public.zoom_settings to authenticated;
grant all on public.zoom_settings to service_role;
alter table public.zoom_settings enable row level security;
create policy "anyone read zoom" on public.zoom_settings for select to anon, authenticated using (true);
create policy "admins update zoom" on public.zoom_settings for update to authenticated using (public.has_role(auth.uid(),'admin'));

-- Zoom bookings
create table public.zoom_bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users(id) on delete cascade,
  client_name text,
  client_email text,
  topic text not null,
  scheduled_at timestamptz not null,
  duration_min int default 30,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.zoom_bookings to authenticated;
grant all on public.zoom_bookings to service_role;
alter table public.zoom_bookings enable row level security;
create policy "clients own bookings" on public.zoom_bookings for select to authenticated
  using (client_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "clients create bookings" on public.zoom_bookings for insert to authenticated
  with check (client_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins update bookings" on public.zoom_bookings for update to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- Branding media
create table public.branding_media (
  id uuid primary key default gen_random_uuid(),
  tab text not null check (tab in ('carousel','gallery')),
  url text not null,
  caption text,
  position int,
  created_at timestamptz not null default now()
);
grant select on public.branding_media to anon, authenticated;
grant insert, update, delete on public.branding_media to authenticated;
grant all on public.branding_media to service_role;
alter table public.branding_media enable row level security;
create policy "public read branding" on public.branding_media for select to anon, authenticated using (true);
create policy "admins manage branding" on public.branding_media for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
alter publication supabase_realtime add table public.branding_media;

-- Portfolio
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null default 'Untitled Project',
  description text not null default '',
  cover text,
  media jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
grant select on public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;
grant all on public.portfolio_items to service_role;
alter table public.portfolio_items enable row level security;
create policy "public read portfolio" on public.portfolio_items for select to anon, authenticated using (true);
create policy "admins manage portfolio" on public.portfolio_items for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
alter publication supabase_realtime add table public.portfolio_items;

-- Storage bucket for admin media
insert into storage.buckets (id, name, public) values ('admin-media','admin-media',true)
on conflict (id) do nothing;
create policy "public read admin-media" on storage.objects for select to anon, authenticated
  using (bucket_id = 'admin-media');
create policy "admins upload admin-media" on storage.objects for insert to authenticated
  with check (bucket_id = 'admin-media' and public.has_role(auth.uid(),'admin'));
create policy "admins update admin-media" on storage.objects for update to authenticated
  using (bucket_id = 'admin-media' and public.has_role(auth.uid(),'admin'));
create policy "admins delete admin-media" on storage.objects for delete to authenticated
  using (bucket_id = 'admin-media' and public.has_role(auth.uid(),'admin'));
