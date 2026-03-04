-- Create signatures storage bucket
insert into storage.buckets (id, name, public)
values ('signatures', 'signatures', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own signatures
create policy "signatures_insert_own" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'signatures' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to read all signatures (needed for PDF export)
create policy "signatures_select_all" on storage.objects for select
  to authenticated
  using (bucket_id = 'signatures');

-- Allow authenticated users to update their own signatures
create policy "signatures_update_own" on storage.objects for update
  to authenticated
  using (bucket_id = 'signatures' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own signatures
create policy "signatures_delete_own" on storage.objects for delete
  to authenticated
  using (bucket_id = 'signatures' AND (storage.foldername(name))[1] = auth.uid()::text);
