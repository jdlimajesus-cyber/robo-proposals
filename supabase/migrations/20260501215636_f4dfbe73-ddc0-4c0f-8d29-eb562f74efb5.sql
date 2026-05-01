-- ============================================
-- 1. PROFILES TABLE (user data)
-- ============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_at trigger function (shared)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. ADD user_id + branding to companies
-- ============================================
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS brand_primary_color TEXT DEFAULT '#1a3a5c',
  ADD COLUMN IF NOT EXISTS brand_secondary_color TEXT DEFAULT '#e67e22',
  ADD COLUMN IF NOT EXISTS brand_accent_color TEXT DEFAULT '#0f1419',
  ADD COLUMN IF NOT EXISTS doc_id_prefix TEXT DEFAULT 'DOC',
  ADD COLUMN IF NOT EXISTS brand_font_family TEXT DEFAULT 'IBM Plex Sans',
  ADD COLUMN IF NOT EXISTS brand_tagline TEXT;

-- Drop legacy public policies
DROP POLICY IF EXISTS "Allow public delete companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public insert companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public read companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public update companies" ON public.companies;

CREATE POLICY "Users view own companies"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own companies"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own companies"
  ON public.companies FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);

-- ============================================
-- 3. ADD user_id + structured JSON to generated_documents
-- ============================================
ALTER TABLE public.generated_documents
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS structured_data JSONB,
  ADD COLUMN IF NOT EXISTS doc_code TEXT;

DROP POLICY IF EXISTS "Allow public delete documents" ON public.generated_documents;
DROP POLICY IF EXISTS "Allow public insert documents" ON public.generated_documents;
DROP POLICY IF EXISTS "Allow public read documents" ON public.generated_documents;
DROP POLICY IF EXISTS "Allow public update documents" ON public.generated_documents;

CREATE POLICY "Users view own documents"
  ON public.generated_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own documents"
  ON public.generated_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own documents"
  ON public.generated_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own documents"
  ON public.generated_documents FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON public.generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_company_id ON public.generated_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_client_id ON public.generated_documents(client_id);