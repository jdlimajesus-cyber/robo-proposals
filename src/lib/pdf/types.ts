/**
 * Structured data types for the PDF proposal document.
 * These types represent the parsed content from the AI-generated HTML.
 */

export interface ProposalData {
  meta: ProposalMeta;
  sections: ProposalSection[];
  gantt?: GanttData;
  alternatives?: AlternativesTable;
  riskMatrix?: RiskItem[];
  costBreakdown?: CostGroup[];
}

export interface ProposalMeta {
  title: string;
  subtitle?: string;
  clientName: string;
  clientLogo?: string;
  companyName: string;
  companyLogo?: string;
  date: string;
  version: string;
  validity?: string;
  proposalId?: string;
  confidential?: boolean;
}

export interface ProposalSection {
  number: string;        // "1", "2", "3.1", etc.
  title: string;
  content: ContentBlock[];
  orientation?: "portrait" | "landscape";
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; highlightHeader?: boolean }
  | { type: "highlight"; text: string; variant: "info" | "warning" | "success" | "money" }
  | { type: "image-placeholder"; description: string }
  | { type: "gap" };

export interface GanttData {
  totalWeeks: number;
  phases: GanttPhase[];
  milestones: GanttMilestone[];
}

export interface GanttPhase {
  name: string;
  start: number;
  end: number;
  color: string;
}

export interface GanttMilestone {
  week: number;
  label: string;
}

export interface AlternativesTable {
  options: AlternativeOption[];
}

export interface AlternativeOption {
  name: string;
  description: string;
  features: string[];
  price?: string;
  recommended?: boolean;
}

export interface RiskItem {
  risk: string;
  probability: "Baixa" | "Média" | "Alta";
  impact: "Baixo" | "Médio" | "Alto";
  mitigation: string;
}

export interface CostGroup {
  group: string;
  items: CostItem[];
  subtotal?: string;
}

export interface CostItem {
  description: string;
  quantity?: string;
  unit?: string;
  unitPrice?: string;
  total?: string;
}
