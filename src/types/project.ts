export interface ProjectData {
  tipo_aplicacao: string;
  producao: number;
  peca: string;
  peso: number;
  dimensoes: string;
  ambiente: string;
  automacao: string;
  processo_atual: string;
  objetivo: string;
  observacoes: string;
}

export type AppStep = "form" | "generating" | "preview";
