import { pdf } from "@react-pdf/renderer";
import React from "react";
import { AxizProposalDocument } from "./AxizDocument";
import type { StructuredProposalData } from "@/types/project";

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9À-ÿ\-_. ]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 120);
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent?: string;
}

/**
 * Native PDF generation from structured JSON (Axiz layout).
 */
export async function generateStructuredPdf(
  data: StructuredProposalData,
  brand: BrandColors,
  fileName: string,
  onProgress?: (stage: string) => void
): Promise<void> {
  onProgress?.("Renderizando PDF...");
  const doc = React.createElement(AxizProposalDocument, { data, brand }) as any;
  const blob = await pdf(doc).toBlob();

  onProgress?.("Preparando download...");
  const safe = sanitizeFileName(fileName);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safe.endsWith(".pdf") ? safe : `${safe}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  onProgress?.("PDF gerado!");
}
