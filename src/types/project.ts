export interface Company {
  id: string;
  company_type: "internal" | "customer";
  name: string;
  legal_name?: string;
  address?: string;
  contact_info?: string;
  logo_url?: string;
  default_payment_terms?: string;
  default_warranty_period?: string;
}

export interface ProjectData {
  // Dados Gerais (Obrigatórios)
  company_internal_id: string;
  client_id: string;
  project_title: string;
  initial_objective: "Gerar Escopo Técnico" | "Gerar Proposta Técnica e Comercial";
  custom_scope_description: string;
  proposal_version: "Basica" | "Normal" | "Completa";

  // Parâmetros Técnicos
  application_type: string;
  production_target?: number;
  target_cycle_time?: number;
  piece_weight?: number;
  piece_dimensions?: string;
  automation_level?: string;
  operational_environment?: string;
  product_name?: string;
  work_shifts?: number;
  continuous_operation?: boolean;
  material?: string;
  surface_finish?: string;
  operating_temperature?: string;

  // Infraestrutura
  installation_area_size?: string;
  available_power_supply?: string;
  available_compressed_air?: string;

  // Dados Comerciais
  investment_range_basic?: string;
  investment_range_intermediate?: string;
  investment_range_optimized?: string;

  // Legacy / extra
  observacoes?: string;

  // Resolved data from DB (populated before sending to edge function)
  company_name?: string;
  client_name?: string;
  client_legal_name?: string;
  client_address?: string;
  client_contact_info?: string;
}

export interface GeneratedDocument {
  id: string;
  company_id?: string;
  client_id?: string;
  project_title: string;
  document_type: "proposta" | "escopo";
  document_version: "Basica" | "Normal" | "Completa";
  generation_date: string;
  input_form_data: ProjectData;
  output_html?: string;
  output_file_name?: string;
  status: "generated" | "editing" | "finalized";
  created_at: string;
  // joined
  company?: Company;
  client?: Company;
}

export type AppStep = "form" | "generating" | "preview";
