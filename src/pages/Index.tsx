import { useState } from "react";
import { ProjectForm } from "@/components/ProjectForm";
import { ProposalPreview } from "@/components/ProposalPreview";
import { GeneratingState } from "@/components/GeneratingState";
import { ProjectData, AppStep, StructuredProposalData } from "@/types/project";
import { useDocuments } from "@/hooks/use-documents";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function generateFileName(data: ProjectData, docId?: string): string {
  const type = data.initial_objective === "Gerar Escopo Técnico" ? "ESCO" : "PROP";
  const clientName = (data.client_name || "CLIENTE")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "").slice(0, 30);
  const project = (data.project_title || "PROJETO")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "").slice(0, 30);
  const versionMap: Record<string, string> = { Basica: "Bas", Normal: "Nor", Completa: "Com" };
  const ver = versionMap[data.proposal_version] || "Com";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const idPart = docId ? `-${docId}` : "";
  return `${type}-${clientName}-${project}-${ver}-${date}${idPart}.pdf`;
}

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AppStep>("form");
  const [proposalHtml, setProposalHtml] = useState("");
  const [structured, setStructured] = useState<StructuredProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proposalId, setProposalId] = useState(() => `prop_${Date.now()}`);
  const [currentFormData, setCurrentFormData] = useState<ProjectData | null>(null);
  const { saveDocument } = useDocuments();

  const handleGenerateProposal = async (data: ProjectData) => {
    setIsLoading(true);
    setStep("generating");
    setProposalHtml("");
    setStructured(null);
    setCurrentFormData(data);

    try {
      const { data: result, error } = await supabase.functions.invoke("generate-proposal", {
        body: { projectData: data },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      if (!result?.html || !result?.structured) {
        console.error("Invalid generator response:", result);
        throw new Error("Resposta inválida do gerador");
      }
      const fullHtml: string = result.html;
      const structuredData: StructuredProposalData = result.structured;
      const docId: string = result.docId;

      setProposalHtml(fullHtml);
      setStructured(structuredData);

      const fileName = generateFileName(data, docId);
      await saveDocument({
        company_id: data.company_internal_id || undefined,
        client_id: data.client_id || undefined,
        project_title: data.project_title,
        document_type: data.initial_objective === "Gerar Escopo Técnico" ? "escopo" : "proposta",
        document_version: data.proposal_version,
        input_form_data: data as any,
        output_html: fullHtml,
        output_file_name: fileName,
        doc_code: docId,
        structured_data: structuredData,
        status: "generated",
      });

      setStep("preview");
      toast.success("Proposta gerada com sucesso!");
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao gerar proposta");
      setStep("form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("form");
    setProposalHtml("");
    setStructured(null);
    setProposalId(`prop_${Date.now()}`);
    setCurrentFormData(null);
  };

  if (step === "generating") return <GeneratingState />;

  if (step === "preview" && proposalHtml) {
    return (
      <ProposalPreview
        html={proposalHtml}
        structured={structured || undefined}
        formData={currentFormData || undefined}
        onBack={handleBack}
        proposalId={proposalId}
      />
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" onClick={() => navigate("/historico")} className="gap-2 shadow-md bg-card">
          <History className="h-4 w-4" /> Histórico
        </Button>
      </div>
      <ProjectForm onSubmit={handleGenerateProposal} isLoading={isLoading} />
    </>
  );
};

export default Index;
