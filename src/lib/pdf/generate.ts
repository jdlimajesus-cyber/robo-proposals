import { pdf } from "@react-pdf/renderer";
import React from "react";
import { ProposalDocument } from "./ProposalDocument";
import { parseHtmlToProposalData } from "./html-parser";
import type { ProposalMeta } from "./types";

/**
 * Sanitizes a filename for PDF export.
 */
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9À-ÿ\-_. ]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
}

/**
 * Generates a native PDF from HTML proposal content.
 * Uses @react-pdf/renderer for pixel-perfect output.
 */
export async function generateProposalPdf(
  htmlContent: string,
  fileName: string,
  meta?: Partial<ProposalMeta>,
  onProgress?: (stage: string) => void
): Promise<void> {
  onProgress?.("Analisando conteúdo...");

  // 1. Parse HTML into structured data
  const proposalData = parseHtmlToProposalData(htmlContent, meta);

  onProgress?.("Gerando documento PDF...");

  // 2. Create the PDF document
  const doc = React.createElement(ProposalDocument, { data: proposalData }) as any;
  const blob = await pdf(doc).toBlob();

  onProgress?.("Preparando download...");

  // 3. Download
  const safeName = sanitizeFileName(fileName);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  onProgress?.("PDF gerado com sucesso!");
}
