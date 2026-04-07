import { useState } from "react";
import { ProjectForm } from "@/components/ProjectForm";
import { ProposalPreview } from "@/components/ProposalPreview";
import { GeneratingState } from "@/components/GeneratingState";
import { ProjectData, AppStep } from "@/types/project";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-proposal`;

const Index = () => {
  const [step, setStep] = useState<AppStep>("form");
  const [proposalHtml, setProposalHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proposalId, setProposalId] = useState(() => `prop_${Date.now()}`);

  const handleGenerateProposal = async (data: ProjectData) => {
    setIsLoading(true);
    setStep("generating");
    setProposalHtml("");

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
        for (let raw of buffer.split("\n")) {
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
  };

  if (step === "generating" && !proposalHtml) {
    return <GeneratingState />;
  }

  if (step === "preview" || proposalHtml) {
    return <ProposalPreview html={proposalHtml} onBack={handleBack} proposalId={proposalId} />;
  }

  return <ProjectForm onSubmit={handleGenerateProposal} isLoading={isLoading} />;
};

export default Index;
