ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS authorized_person_name text,
  ADD COLUMN IF NOT EXISTS authorized_person_title text,
  ADD COLUMN IF NOT EXISTS authorized_person_crea text,
  ADD COLUMN IF NOT EXISTS authorized_person_cpf text,
  ADD COLUMN IF NOT EXISTS signature_image_url text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text;