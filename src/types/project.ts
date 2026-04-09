export interface ProjectData {
  // Dados Gerais (Obrigatórios)
  client_name: string;
  project_title: string;
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
}

export type AppStep = "form" | "generating" | "preview";
