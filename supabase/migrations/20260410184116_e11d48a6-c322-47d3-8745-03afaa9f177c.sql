
-- Companies table (internal companies)
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_type TEXT NOT NULL DEFAULT 'internal' CHECK (company_type IN ('internal', 'customer')),
  name TEXT NOT NULL,
  legal_name TEXT,
  address TEXT,
  contact_info TEXT,
  logo_url TEXT,
  default_payment_terms TEXT,
  default_warranty_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Generated documents table
CREATE TABLE public.generated_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  client_id UUID REFERENCES public.companies(id),
  project_title TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'proposta' CHECK (document_type IN ('proposta', 'escopo')),
  document_version TEXT NOT NULL DEFAULT 'Completa' CHECK (document_version IN ('Basica', 'Normal', 'Completa')),
  generation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  input_form_data JSONB,
  output_html TEXT,
  output_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'editing', 'finalized')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (no auth required for now)
CREATE POLICY "Allow public read companies" ON public.companies FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert companies" ON public.companies FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update companies" ON public.companies FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete companies" ON public.companies FOR DELETE TO anon USING (true);

CREATE POLICY "Allow public read documents" ON public.generated_documents FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert documents" ON public.generated_documents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update documents" ON public.generated_documents FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete documents" ON public.generated_documents FOR DELETE TO anon USING (true);
