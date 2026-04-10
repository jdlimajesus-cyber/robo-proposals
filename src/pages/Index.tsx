import { useState } from "react";
import { ProjectForm } from "@/components/ProjectForm";
import { ProposalPreview } from "@/components/ProposalPreview";
import { GeneratingState } from "@/components/GeneratingState";
import { ProjectData, AppStep } from "@/types/project";
import { useDocuments } from "@/hooks/use-documents";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-proposal`;

function generateFileName(data: ProjectData): string {
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
  return `${type}-${clientName}-${project}-${ver}-${date}.pdf`;
}

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AppStep>("form");
  const [proposalHtml, setProposalHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proposalId, setProposalId] = useState(() => `prop_${Date.now()}`);
  const [currentFormData, setCurrentFormData] = useState<ProjectData | null>(null);
  const { saveDocument } = useDocuments();

  const handleGenerateProposal = async (data: ProjectData) => {
    setIsLoading(true);
    setStep("generating");
    setProposalHtml("");
    setCurrentFormData(data);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ projectData: data }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(errorData.error || `Erro ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullHtml = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullHtml += content;
              setProposalHtml(fullHtml);
              if (step !== "preview") setStep("preview");
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (const raw of buffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "" || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullHtml += content;
              setProposalHtml(fullHtml);
            }
          } catch {}
        }
      }

      // Save to database
      const fileName = generateFileName(data);
      await saveDocument({
        company_id: data.company_internal_id || undefined,
        client_id: data.client_id || undefined,
        project_title: data.project_title,
        document_type: data.initial_objective === "Gerar Escopo Técnico" ? "escopo" : "proposta",
        document_version: data.proposal_version,
        input_form_data: data as any,
        output_html: fullHtml,
        output_file_name: fileName,
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
    setProposalId(`prop_${Date.now()}`);
    setCurrentFormData(null);
  };

  if (step === "generating" && !proposalHtml) {
    return <GeneratingState />;
  }

  if (step === "preview" || proposalHtml) {
    return <ProposalPreview html={proposalHtml} onBack={handleBack} proposalId={proposalId} />;
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
