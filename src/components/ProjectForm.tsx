import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ProjectData } from "@/types/project";
import { Bot, Cog, Factory, Zap } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading: boolean;
}

const tiposAplicacao = [
  "Soldagem Robotizada",
  "Paletização",
  "Pick and Place",
  "Montagem Automatizada",
  "Pintura Industrial",
  "Inspeção de Qualidade",
  "Alimentação de Máquinas (Machine Tending)",
  "Corte e Desbaste",
  "Polimento e Acabamento",
  "Embalagem Automatizada",
  "Manipulação de Materiais",
  "Dosagem e Aplicação de Adesivos",
  "Outro",
];

const ambientes = [
  "Industrial padrão",
  "Alta temperatura",
  "Ambiente corrosivo",
  "Sala limpa (Clean Room)",
  "Área explosiva (ATEX)",
  "Ambiente úmido",
  "Ambiente externo",
];

const niveisAutomacao = [
  "Semi-automático (com intervenção do operador)",
  "Totalmente automático",
  "Colaborativo (robô + operador)",
];

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    tipo_aplicacao: "",
    producao: 0,
    peca: "",
    peso: 0,
    dimensoes: "",
    ambiente: "Industrial padrão",
    automacao: "Totalmente automático",
    processo_atual: "",
    objetivo: "",
    observacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof ProjectData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="brand-gradient py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Factory className="h-10 w-10 text-primary-foreground" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Engenharia Comercial
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Geração inteligente de propostas técnicas e comerciais para células robotizadas e máquinas especiais
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-primary-foreground/70 text-sm">
            <span className="flex items-center gap-1"><Bot className="h-4 w-4" /> IA Integrada</span>
            <span className="flex items-center gap-1"><Cog className="h-4 w-4" /> Cálculos Automáticos</span>
            <span className="flex items-center gap-1"><Zap className="h-4 w-4" /> Proposta Completa</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <Card className="p-8 shadow-lg animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground mb-6">Dados do Projeto</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Aplicação *</Label>
                <Select value={formData.tipo_aplicacao} onValueChange={(v) => updateField("tipo_aplicacao", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                  <SelectContent>
                    {tiposAplicacao.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="producao">Produção Desejada (peças/hora) *</Label>
                <Input
                  id="producao"
                  type="number"
                  min={1}
                  placeholder="Ex: 120"
                  value={formData.producao || ""}
                  onChange={(e) => updateField("producao", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="peca">Descrição da Peça *</Label>
                <Input
                  id="peca"
                  placeholder="Ex: Carcaça de motor elétrico"
                  value={formData.peca}
                  onChange={(e) => updateField("peca", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso da Peça (kg) *</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="Ex: 5.5"
                  value={formData.peso || ""}
                  onChange={(e) => updateField("peso", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensoes">Dimensões (mm)</Label>
                <Input
                  id="dimensoes"
                  placeholder="Ex: 300x200x150"
                  value={formData.dimensoes}
                  onChange={(e) => updateField("dimensoes", e.target.value)}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ambiente">Ambiente</Label>
                <Select value={formData.ambiente} onValueChange={(v) => updateField("ambiente", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ambientes.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="automacao">Nível de Automação</Label>
                <Select value={formData.automacao} onValueChange={(v) => updateField("automacao", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {niveisAutomacao.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <Label htmlFor="processo">Processo Atual</Label>
              <Textarea
                id="processo"
                placeholder="Descreva como o processo é realizado atualmente..."
                value={formData.processo_atual}
                onChange={(e) => updateField("processo_atual", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo do Projeto *</Label>
              <Textarea
                id="objetivo"
                placeholder="Descreva o objetivo principal do projeto de automação..."
                value={formData.objetivo}
                onChange={(e) => updateField("objetivo", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="obs">Observações</Label>
              <Textarea
                id="obs"
                placeholder="Informações adicionais relevantes..."
                value={formData.observacoes}
                onChange={(e) => updateField("observacoes", e.target.value)}
                rows={2}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.tipo_aplicacao || !formData.producao || !formData.peca || !formData.peso || !formData.objetivo}
              className="w-full h-12 text-lg font-semibold brand-gradient hover:opacity-90 text-primary-foreground"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Cog className="h-5 w-5 animate-spin" /> Gerando Proposta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Gerar Proposta Técnica e Comercial
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
