-- Create patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre_completo text not null,
  cedula text not null,
  genero text check (genero in ('masculino', 'femenino', 'otro')),
  fecha_nacimiento date,
  edad integer,
  empresa text,
  cargo text,
  telefono text,
  email text,
  fecha_registro timestamptz default now(),
  estado text default 'activo' check (estado in ('activo', 'inactivo'))
);

-- Create unique index on cedula per user
create unique index if not exists patients_cedula_user_idx on public.patients(cedula, user_id);

alter table public.patients enable row level security;

create policy "patients_select_own" on public.patients for select using (auth.uid() = user_id);
create policy "patients_insert_own" on public.patients for insert with check (auth.uid() = user_id);
create policy "patients_update_own" on public.patients for update using (auth.uid() = user_id);
create policy "patients_delete_own" on public.patients for delete using (auth.uid() = user_id);
