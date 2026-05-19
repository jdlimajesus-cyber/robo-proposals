export interface Company {
  id: string;
  user_id?: string;
  company_type: "internal" | "customer";
  name: string;
  legal_name?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  contact_info?: string;
  logo_url?: string;
  default_payment_terms?: string;
  default_warranty_period?: string;
  authorized_person_name?: string;
  authorized_person_title?: string;
  authorized_person_crea?: string;
  authorized_person_cpf?: string;
  signature_image_url?: string;
  // Branding (para empresas internas)
  brand_primary_color?: string;
  brand_secondary_color?: string;
  brand_accent_color?: string;
  doc_id_prefix?: string;
  brand_font_family?: string;
  brand_tagline?: string;
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
  company_legal_name?: string;
  company_cnpj?: string;
  company_address?: string;
  company_city?: string;
  company_state?: string;
  company_contact_info?: string;
  company_logo_url?: string;
  company_authorized_person_name?: string;
  company_authorized_person_title?: string;
  company_authorized_person_crea?: string;
  company_authorized_person_cpf?: string;
  company_signature_image_url?: string;
  company_payment_terms?: string;
  company_warranty_period?: string;
  company_brand_primary_color?: string;
  company_brand_secondary_color?: string;
  company_brand_accent_color?: string;
  company_doc_id_prefix?: string;
  company_brand_tagline?: string;
  client_name?: string;
  client_legal_name?: string;
  client_cnpj?: string;
  client_address?: string;
  client_city?: string;
  client_state?: string;
  client_contact_info?: string;
}

// Structured data emitted by the LLM for native PDF generation
export interface StructuredProposalData {
  meta: {
    title: string;
    subtitle?: string;
    docId: string;
    version: string;
    date: string;
    validity: string;
    status: string;
    clientName: string;
    clientLegalName?: string;
    clientCnpj?: string;
    companyName: string;
    companyLegalName?: string;
    companyCnpj?: string;
    companyTagline?: string;
    confidential: boolean;
  };
  executive: {
    summary: string;
    note?: string;
    headlineMetrics: { label: string; value: string }[];
  };
  specs: { label: string; value: string }[];
  subsystems?: {
    code: string;
    name: string;
    discipline: string;
    objective: string;
    description: string;
    components: { name: string; specification: string; function: string }[];
    technicalParams: { label: string; value: string }[];
    standards: string[];
    interfaces?: string;
  }[];
  bom: {
    categories: {
      code: string;
      name: string;
      subtotal?: string;
      items: {
        code: string;
        description: string;
        discipline?: string;
        quantity: string;
        unit: string;
        unitPrice: string;
        total: string;
        status?: string;
      }[];
    }[];
    totals: { label: string; value: string; highlight?: boolean }[];
  };
  schedule: {
    totalWeeks: number;
    phases: {
      name: string;
      responsible: string;
      startWeek: number;
      endWeek: number;
      milestones: string;
    }[];
  };
  risks: {
    level: "ALTO" | "MEDIO" | "BAIXO";
    category: string;
    description: string;
    probability: "Baixa" | "Média" | "Alta";
    impact: "Baixo" | "Médio" | "Alto";
    mitigation: string;
  }[];
  roi: {
    scenario: "Conservador" | "Base" | "Otimista";
    capex: string;
    annualBenefit: string;
    paybackMonths: string;
    assumption: string;
  }[];
  acceptance: {
    contractor: { label: string; name?: string; title?: string; cnpj?: string };
    contracted: { label: string; name?: string; title?: string; crea?: string; cnpj?: string };
  };

  // ===== Seções avançadas (template 16 seções) =====
  context?: {
    needAnalysis: string; // 2-3 parágrafos
    fato: string;
    premissa: string;
    hipotese: string;
    premisesList: string[]; // bullets quantitativos
    processFlow: { step: number; label: string }[];
    flowDescription: string;
  };
  alternatives?: {
    code: string; // A1, A2, A3
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    operationalRisk: string;
    qualityRisk?: string;
    recommended: boolean;
  }[];
  solution?: {
    architectureDescription: string;
    technicalDetails: {
      title: string; // ex 4.2.1 Cabines de Pintura
      paragraphs: string[];
      calculations?: { label: string; lines: string[] }[]; // caixas de cálculo
      bullets?: string[];
    }[];
    equipmentSpecs: {
      name: string; // ex Cabine de Pintura para Base (Primer)
      bullets: string[];
    }[];
  };
  scopeDetail?: {
    suppliedEquipment: { name: string; bullets: string[] }[];
    servicesIncluded: string[];
    itemsNotIncluded: string[];
    automationDiagramNote?: string;
    cybersecurity?: {
      otNetwork: string[];
      itNetwork: string[];
      measures: string[];
      riskNote: string;
    };
  };
  resources?: { area: string; allocated: string; profile: string }[];
  costSummary?: {
    items: { code: string; description: string; value: string; observations: string }[];
    total: string;
    composition: { label: string; percentage: string; description: string }[];
    categoryDistribution: { label: string; percentage: string }[];
  };
  schedulePhaseTable?: { name: string; durationWeeks: number; cumulative: number }[];
  acceptanceCriteria?: { criterion: string; target: string; validationMethod: string }[];
  dataToConfirm?: { group: string; items: string[] }[];
  conceptualVisualization?: { label: string; description: string }[];
  roiAnalysis?: {
    premises: string[];
    benefits: { label: string; annual: string }[];
    benefitsTotal: string;
    opex: { label: string; annual: string }[];
    opexTotal: string;
    netCashFlow: string;
    results: { vpl: string; tir: string; payback: string };
    sensitivity: { scenario: string; capex: string; vpl: string; tir: string; payback: string }[];
    conclusion: string;
  };
  safetyAnalysis?: {
    hazards: { hazard: string; source: string; analysis: string }[];
    engineeringControls: string[];
    administrativeControls: string[];
    ppe: string[];
    complianceNote: string;
  };
  electricalSpecs?: {
    distribution: string[];
    protection: string[];
    powerQuality: string[];
    complianceNote: string;
  };
  executiveControl?: {
    elaboratedBy: string;
    emissionDate: string;
    versionNote: string;
    confidentialityNote: string;
    nextSteps: string[];
    signatures: { name: string; role: string }[];
  };
}


export interface GeneratedDocument {
  id: string;
  user_id?: string;
  company_id?: string;
  client_id?: string;
  project_title: string;
  document_type: "proposta" | "escopo";
  document_version: "Basica" | "Normal" | "Completa";
  generation_date: string;
  input_form_data: ProjectData;
  output_html?: string;
  output_file_name?: string;
  doc_code?: string;
  structured_data?: StructuredProposalData;
  status: "generated" | "editing" | "finalized";
  created_at: string;
  // joined
  company?: Company;
  client?: Company;
}

export type AppStep = "form" | "generating" | "preview";
