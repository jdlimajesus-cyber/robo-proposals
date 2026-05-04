import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Printer, Pencil, PencilOff, History, Loader2 } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import { VersionHistoryPanel } from "@/components/VersionHistoryPanel";
import { useProposalVersions } from "@/hooks/use-proposal-versions";
import { generateStructuredPdf } from "@/lib/pdf/generateStructured";
import { toast } from "sonner";
import type { StructuredProposalData, ProjectData } from "@/types/project";

interface ProposalPreviewProps {
  html: string;
  structured?: StructuredProposalData;
  formData?: ProjectData;
  onBack: () => void;
  proposalId?: string;
}

const A4_PRINT_STYLES = `
  @page {
    size: A4;
    margin: 25mm 20mm;
    marks: none;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: 'Segoe UI', 'Inter', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333333;
    background: white;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* ===== PAGE BREAK CONTROL ===== */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Headings must stay with at least 3 lines of content after them */
  h1 + *, h2 + *, h3 + * {
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  p {
    orphans: 3;
    widows: 3;
  }

  table {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  ul, ol {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  figure, .figure, img {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Highlight boxes, recommendation boxes, risk boxes */
  div[style*="border-left"], div[style*="border-radius"] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Signature blocks */
  div[style*="grid-template-columns"] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Cover page - always on its own page */
  div[style*="min-height:80vh"], div[style*="min-height: 80vh"] {
    page-break-after: always !important;
    break-after: page !important;
  }

  /* Section headings with blue background = new page */
  div[style*="background:#1a237e"], div[style*="background: #1a237e"] {
    page-break-before: always !important;
    break-before: page !important;
  }

  /* Ensure images don't overflow */
  img {
    max-width: 100% !important;
    max-height: 200mm !important;
    height: auto !important;
  }

  /* Keep signature/closing section together */
  div[style*="TERMO DE ACEITE"], div[style*="ASSINATURAS"] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Footer stays at bottom */
  div[style*="border-top:2px solid #e5e7eb"] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Cost tables - keep together or break cleanly */
  table[style*="border-collapse"] {
    page-break-inside: auto !important;
  }

  /* Large tables: allow break but keep header */
  table[style*="border-collapse"] thead {
    display: table-header-group !important;
  }

  /* Prevent empty pages */
  .proposal-container > div:empty {
    display: none !important;
  }
`;

export function ProposalPreview({ html, onBack, proposalId = "default" }: ProposalPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentHtml, setCurrentHtml] = useState(html);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const { versions, activeVersionId, saveVersion, loadVersion, deleteVersion, getLatestContent } =
    useProposalVersions(proposalId);

  // On first mount, check for saved content or save initial version
  useEffect(() => {
    const saved = getLatestContent();
    if (saved && saved !== html) {
      setCurrentHtml(saved);
    } else if (versions.length === 0 && html) {
      saveVersion(html, "generated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update when new html streams in
  useEffect(() => {
    setCurrentHtml(html);
  }, [html]);

  const handleInput = useCallback(() => {
    if (!contentRef.current) return;
    const updated = contentRef.current.innerHTML;
    setCurrentHtml(updated);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveVersion(updated, "edited");
    }, 2000);
  }, [saveVersion]);

  const toggleEdit = () => {
    if (isEditing && contentRef.current) {
      saveVersion(contentRef.current.innerHTML, "edited");
    }
    setIsEditing((prev) => !prev);
  };

  const handleLoadVersion = (versionId: number) => {
    const content = loadVersion(versionId);
    if (content) {
      setCurrentHtml(content);
    }
  };

  const handleSaveManual = () => {
    if (contentRef.current) {
      saveVersion(contentRef.current.innerHTML, "manual");
    }
  };

  const buildPrintHtml = (content: string) => {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Técnica e Comercial</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${A4_PRINT_STYLES}

    /* ===== DOCUMENT STYLING ===== */
    body {
      margin: 0;
      padding: 0;
    }

    /* Proposal title styles */
    .proposal-title {
      font-size: 24px;
      font-weight: 700;
      border-bottom: 3px solid #1a237e;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .proposal-subtitle {
      font-size: 18px;
      font-weight: 600;
      margin-top: 32px;
      margin-bottom: 16px;
      border-left: 4px solid #ff9800;
      padding-left: 12px;
    }

    .proposal-text {
      font-size: 11pt;
      line-height: 1.6;
      margin-bottom: 16px;
      text-align: justify;
    }

    .proposal-list {
      padding-left: 24px;
      margin-bottom: 16px;
    }

    .proposal-list li {
      margin-bottom: 4px;
      font-size: 11pt;
    }

    .proposal-section {
      margin-bottom: 24px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
    }

    /* Image placeholder styling */
    .image-container {
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      margin: 24px 0;
      background: #f1f5f9;
      page-break-inside: avoid !important;
    }

    /* Tables - professional styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 10pt;
    }

    th {
      background: #1a237e !important;
      color: white !important;
      padding: 8px 12px;
      text-align: left;
      font-weight: 600;
      border: 1px solid #1a237e;
    }

    td {
      padding: 6px 12px;
      border: 1px solid #ddd;
    }

    tr:nth-child(even) {
      background: #f9f9f9;
    }

    /* Section headers with background */
    h1[style*="background"], div[style*="background:#1a237e"] h1,
    div[style*="background: #1a237e"] {
      page-break-before: always !important;
    }

    /* Highlight boxes */
    div[style*="border-left:4px"] {
      page-break-inside: avoid !important;
      margin: 12px 0;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .image-container { page-break-inside: avoid; }
    }
  </style>
</head>
<body>${content}</body>
</html>`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = contentRef.current?.innerHTML || currentHtml;
    printWindow.document.write(buildPrintHtml(content));
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfProgress("Iniciando...");
    try {
      const content = contentRef.current?.innerHTML || currentHtml;
      const fileName = `proposta-${proposalId}.pdf`;
      await generateProposalPdf(content, fileName, undefined, setPdfProgress);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Nova Proposta
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <FileText className="h-4 w-4" /> Proposta Gerada
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={toggleEdit}
              className={`gap-2 ${isEditing ? "brand-gradient text-primary-foreground" : ""}`}
            >
              {isEditing ? <PencilOff className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {isEditing ? "Finalizar Edição" : "Editar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="h-4 w-4" /> Versões ({versions.length})
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
            <Button onClick={handleExportPdf} disabled={isGeneratingPdf} className="gap-2 brand-gradient text-primary-foreground">
              {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isGeneratingPdf ? pdfProgress || "Gerando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className={`max-w-4xl mx-auto px-6 py-8 transition-all ${showHistory ? "mr-80" : ""}`}>
        <div
          ref={contentRef}
          className={`proposal-container bg-card p-8 md:p-12 rounded-xl shadow-lg animate-fade-in ${
            isEditing ? "proposal-editing" : ""
          }`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: currentHtml }}
        />
      </div>

      {/* Version History Panel */}
      {showHistory && (
        <VersionHistoryPanel
          versions={versions}
          activeVersionId={activeVersionId}
          onLoadVersion={handleLoadVersion}
          onDeleteVersion={deleteVersion}
          onClose={() => setShowHistory(false)}
          onSaveManual={handleSaveManual}
        />
      )}
    </div>
  );
}
