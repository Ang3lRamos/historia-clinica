import pg from 'pg';

// Allow self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connStr = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
console.log('[v0] Using connection string starting with:', connStr ? connStr.substring(0, 30) + '...' : 'NONE FOUND');

const client = new pg.Client({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('[v0] Connected to database');

  // Check existing tables
  const existing = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`
  );
  console.log('[v0] Existing tables:', existing.rows.map(r => r.table_name));

  // 1. Create patients table
  console.log('[v0] Creating patients table...');
  await client.query(`
    create table if not exists public.patients (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      nombre text not null,
      apellido text not null,
      documento_tipo text default 'CC' check (documento_tipo in ('CC', 'TI', 'CE', 'PA', 'RC')),
      documento_numero text not null,
      fecha_nacimiento date,
      sexo text check (sexo in ('M', 'F', 'Otro')),
      telefono text,
      email text,
      direccion text,
      ciudad text,
      empresa text,
      cargo text,
      eps text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
  `);
  console.log('[v0] patients table created');

  // 2. RLS for patients
  await client.query(`alter table public.patients enable row level security;`);
  
  // Drop policies if they exist, then create
  const patientPolicies = [
    { name: 'patients_select_own', op: 'SELECT', clause: `USING (auth.uid() = user_id)` },
    { name: 'patients_insert_own', op: 'INSERT', clause: `WITH CHECK (auth.uid() = user_id)` },
    { name: 'patients_update_own', op: 'UPDATE', clause: `USING (auth.uid() = user_id)` },
    { name: 'patients_delete_own', op: 'DELETE', clause: `USING (auth.uid() = user_id)` },
  ];

  for (const p of patientPolicies) {
    await client.query(`DROP POLICY IF EXISTS "${p.name}" ON public.patients;`);
    await client.query(`CREATE POLICY "${p.name}" ON public.patients FOR ${p.op} ${p.clause};`);
  }
  console.log('[v0] patients RLS policies created');

  // 3. Create clinical_histories table
  console.log('[v0] Creating clinical_histories table...');
  await client.query(`
    create table if not exists public.clinical_histories (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      patient_id uuid not null references public.patients(id) on delete cascade,
      fecha_examen date not null default current_date,
      tipo_examen text default 'Visiometria Ocupacional',
      motivo_consulta text,
      antecedentes_personales jsonb default '{}'::jsonb,
      antecedentes_familiares jsonb default '{}'::jsonb,
      antecedentes_ocupacionales jsonb default '{}'::jsonb,
      agudeza_visual jsonb default '{}'::jsonb,
      examen_externo jsonb default '{}'::jsonb,
      queratometria jsonb default '{}'::jsonb,
      oftalmoscopia jsonb default '{}'::jsonb,
      refraccion jsonb default '{}'::jsonb,
      lensometria jsonb default '{}'::jsonb,
      tonometria jsonb default '{}'::jsonb,
      test_complementarios jsonb default '{}'::jsonb,
      diagnostico text,
      conducta text,
      observaciones text,
      concepto text check (concepto in ('Apto', 'Apto con restricciones', 'No apto', 'Aplazado')),
      firma_profesional_url text,
      firma_paciente_url text,
      profesional_nombre text,
      profesional_registro text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
  `);
  console.log('[v0] clinical_histories table created');

  // 4. RLS for clinical_histories
  await client.query(`alter table public.clinical_histories enable row level security;`);
  
  const historyPolicies = [
    { name: 'histories_select_own', op: 'SELECT', clause: `USING (auth.uid() = user_id)` },
    { name: 'histories_insert_own', op: 'INSERT', clause: `WITH CHECK (auth.uid() = user_id)` },
    { name: 'histories_update_own', op: 'UPDATE', clause: `USING (auth.uid() = user_id)` },
    { name: 'histories_delete_own', op: 'DELETE', clause: `USING (auth.uid() = user_id)` },
  ];

  for (const p of historyPolicies) {
    await client.query(`DROP POLICY IF EXISTS "${p.name}" ON public.clinical_histories;`);
    await client.query(`CREATE POLICY "${p.name}" ON public.clinical_histories FOR ${p.op} ${p.clause};`);
  }
  console.log('[v0] clinical_histories RLS policies created');

  // 5. Indexes
  await client.query(`create index if not exists idx_clinical_histories_patient on public.clinical_histories(patient_id);`);
  await client.query(`create index if not exists idx_clinical_histories_user on public.clinical_histories(user_id);`);
  await client.query(`create index if not exists idx_clinical_histories_fecha on public.clinical_histories(fecha_examen desc);`);
  console.log('[v0] Indexes created');

  // 6. Updated_at trigger function
  await client.query(`
    create or replace function public.update_updated_at()
    returns trigger
    language plpgsql
    as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;
  `);

  await client.query(`drop trigger if exists patients_updated_at on public.patients;`);
  await client.query(`
    create trigger patients_updated_at
      before update on public.patients
      for each row execute function public.update_updated_at();
  `);

  await client.query(`drop trigger if exists histories_updated_at on public.clinical_histories;`);
  await client.query(`
    create trigger histories_updated_at
      before update on public.clinical_histories
      for each row execute function public.update_updated_at();
  `);
  console.log('[v0] updated_at triggers created');

  // 7. Create storage bucket for signatures
  // We'll use the Supabase storage API via SQL
  await client.query(`
    insert into storage.buckets (id, name, public)
    values ('signatures', 'signatures', true)
    on conflict (id) do nothing;
  `);
  console.log('[v0] signatures storage bucket created');

  // Storage policies
  await client.query(`DROP POLICY IF EXISTS "signatures_upload" ON storage.objects;`);
  await client.query(`
    CREATE POLICY "signatures_upload" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'signatures' AND auth.role() = 'authenticated');
  `);

  await client.query(`DROP POLICY IF EXISTS "signatures_read" ON storage.objects;`);
  await client.query(`
    CREATE POLICY "signatures_read" ON storage.objects 
    FOR SELECT USING (bucket_id = 'signatures');
  `);
  console.log('[v0] Storage policies created');

  // Final check
  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`
  );
  console.log('[v0] Final tables:', tables.rows.map(r => r.table_name));

  await client.end();
  console.log('[v0] Migration complete!');
}

run().catch(err => {
  console.error('[v0] Migration error:', err.message);
  process.exit(1);
});
