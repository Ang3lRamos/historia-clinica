-- Create clinical histories table
create table if not exists public.clinical_histories (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Exam type
  tipo_examen text check (tipo_examen in ('ingreso', 'cambio_ocupacion', 'periodico', 'retiro', 'post_incapacidad', 'reintegro')),

  -- Antecedentes (stored as JSONB for flexibility)
  antecedentes_oculares jsonb default '{}',
  antecedentes_personales jsonb default '{}',
  sintomas_actuales jsonb default '{}',
  correccion_visual_previa text,
  uso_lentes text,

  -- Agudeza Visual (Snellen)
  agudeza_visual jsonb default '{}',
  vision_color text,
  estereopsis text,

  -- Examen Clinico
  examen_externo_od text,
  examen_externo_oi text,
  cover_test_lejos text,
  cover_test_cerca text,
  oftalmoscopia_od text,
  oftalmoscopia_oi text,
  queratometria_od text,
  queratometria_oi text,
  retinoscopia_od text,
  retinoscopia_oi text,
  lensometria_od text,
  lensometria_oi text,

  -- Diagnosis
  diagnostico text,
  observaciones text,
  remision_eps boolean default false,
  concepto text,

  -- Signatures (URLs to Supabase Storage)
  firma_profesional_url text,
  firma_paciente_url text,

  estado text default 'borrador' check (estado in ('borrador', 'completado'))
);

alter table public.clinical_histories enable row level security;

create policy "histories_select_own" on public.clinical_histories for select using (auth.uid() = user_id);
create policy "histories_insert_own" on public.clinical_histories for insert with check (auth.uid() = user_id);
create policy "histories_update_own" on public.clinical_histories for update using (auth.uid() = user_id);
create policy "histories_delete_own" on public.clinical_histories for delete using (auth.uid() = user_id);

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.clinical_histories
  for each row
  execute function public.handle_updated_at();
