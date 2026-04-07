import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { useRef } from "react";

interface ProposalPreviewProps {
  html: string;
  onBack: () => void;
}

export function ProposalPreview({ html, onBack }: ProposalPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proposta Técnica e Comercial</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; color: #1a1a2e; padding: 40px; line-height: 1.6; }
          .proposal-title { font-size: 24px; font-weight: 700; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
          .proposal-subtitle { font-size: 18px; font-weight: 600; margin-top: 32px; margin-bottom: 16px; border-left: 4px solid #2563eb; padding-left: 12px; }
          .proposal-text { font-size: 14px; line-height: 1.7; margin-bottom: 16px; }
          .proposal-list { padding-left: 24px; margin-bottom: 16px; }
          .proposal-list li { margin-bottom: 4px; font-size: 14px; }
          .proposal-section { margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .image-container { border: 2px dashed #cbd5e1; border-radius: 8px; padding: 32px; text-align: center; margin: 24px 0; background: #f1f5f9; }
          h3 { font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; }
          @media print { body { padding: 20px; } .image-container { page-break-inside: avoid; } }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
            <Button onClick={handlePrint} className="gap-2 brand-gradient text-primary-foreground">
              <Download className="h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div
          ref={contentRef}
          className="proposal-container bg-card p-8 md:p-12 rounded-xl shadow-lg animate-fade-in"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
