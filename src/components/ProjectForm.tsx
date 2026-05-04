import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ProjectData } from "@/types/project";
import { useCompanies } from "@/hooks/use-companies";
import { CompanyDialog } from "@/components/CompanyDialog";
import { Bot, Cog, Factory, Zap, ChevronDown, ChevronUp } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading: boolean;
}

const STORAGE_KEY = "proposal_form_data";

const applicationTypes = [
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
  "Manufatura Aditiva",
  "Moldes de Injeção",
  "Outro",
];

const automationLevels = ["Manual", "Semi-automático", "Totalmente automático"];

const defaultData: ProjectData = {
  company_internal_id: "",
  client_id: "",
  project_title: "",
  initial_objective: "Gerar Proposta Técnica e Comercial",
  custom_scope_description: "",
  proposal_version: "Completa",
  application_type: "",
  production_target: undefined,
  target_cycle_time: undefined,
  piece_weight: undefined,
  piece_dimensions: "",
  automation_level: "Totalmente automático",
  operational_environment: "Industrial padrão",
  product_name: "",
  work_shifts: undefined,
  continuous_operation: false,
  material: "",
  surface_finish: "",
  operating_temperature: "",
  installation_area_size: "",
  available_power_supply: "",
  available_compressed_air: "",
  investment_range_basic: "",
  investment_range_intermediate: "",
  investment_range_optimized: "",
  observacoes: "",
};

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultData, ...JSON.parse(saved) };
    } catch {}
    return defaultData;
  });

  const [showTechnical, setShowTechnical] = useState(false);
  const [showInfra, setShowInfra] = useState(false);
  const [showCommercial, setShowCommercial] = useState(false);

  const { companies: internalCompanies, addCompany: addInternal } = useCompanies("internal");
  const { companies: customers, addCompany: addCustomer } = useCompanies("customer");

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Populate resolved names when selections change
  useEffect(() => {
    const internal = internalCompanies.find((c) => c.id === formData.company_internal_id);
    const client = customers.find((c) => c.id === formData.client_id);
    if (internal || client) {
      setFormData((prev) => ({
        ...prev,
        company_name: internal?.name || prev.company_name,
        company_legal_name: internal?.legal_name || prev.company_legal_name,
        company_cnpj: internal?.cnpj || prev.company_cnpj,
        company_address: internal?.address || prev.company_address,
        company_city: internal?.city || prev.company_city,
        company_state: internal?.state || prev.company_state,
        company_contact_info: internal?.contact_info || prev.company_contact_info,
        company_logo_url: internal?.logo_url || prev.company_logo_url,
        company_authorized_person_name: internal?.authorized_person_name || prev.company_authorized_person_name,
        company_authorized_person_title: internal?.authorized_person_title || prev.company_authorized_person_title,
        company_authorized_person_crea: internal?.authorized_person_crea || prev.company_authorized_person_crea,
        company_authorized_person_cpf: internal?.authorized_person_cpf || prev.company_authorized_person_cpf,
        company_signature_image_url: internal?.signature_image_url || prev.company_signature_image_url,
        company_payment_terms: internal?.default_payment_terms || prev.company_payment_terms,
        company_warranty_period: internal?.default_warranty_period || prev.company_warranty_period,
        company_brand_primary_color: internal?.brand_primary_color || prev.company_brand_primary_color,
        company_brand_secondary_color: internal?.brand_secondary_color || prev.company_brand_secondary_color,
        company_brand_accent_color: internal?.brand_accent_color || prev.company_brand_accent_color,
        company_doc_id_prefix: internal?.doc_id_prefix || prev.company_doc_id_prefix,
        company_brand_tagline: internal?.brand_tagline || prev.company_brand_tagline,
        client_name: client?.name || prev.client_name,
        client_legal_name: client?.legal_name || prev.client_legal_name,
        client_cnpj: client?.cnpj || prev.client_cnpj,
        client_address: client?.address || prev.client_address,
        client_city: client?.city || prev.client_city,
        client_state: client?.state || prev.client_state,
        client_contact_info: client?.contact_info || prev.client_contact_info,
      }));
    }
  }, [formData.company_internal_id, formData.client_id, internalCompanies, customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof ProjectData, value: string | number | boolean | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showVersionSelect = formData.initial_objective === "Gerar Proposta Técnica e Comercial";

  const isValid =
    formData.company_internal_id !== "" &&
    formData.client_id !== "" &&
    formData.project_title.trim() !== "" &&
    formData.custom_scope_description.trim() !== "" &&
    formData.application_type !== "";

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
            Geração inteligente de propostas técnicas e comerciais para automação industrial
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-primary-foreground/70 text-sm">
            <span className="flex items-center gap-1"><Bot className="h-4 w-4" /> IA Integrada</span>
            <span className="flex items-center gap-1"><Cog className="h-4 w-4" /> Cálculos Automáticos</span>
            <span className="flex items-center gap-1"><Zap className="h-4 w-4" /> Proposta Completa</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 -mt-6 pb-12">
        <Card className="p-8 shadow-lg animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* === SEÇÃO 1: DADOS GERAIS === */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                📋 Dados Gerais
              </h2>

              {/* Sua Empresa + Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <Label>Sua Empresa *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.company_internal_id} onValueChange={(v) => updateField("company_internal_id", v)}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione sua empresa" /></SelectTrigger>
                      <SelectContent>
                        {internalCompanies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CompanyDialog type="internal" onSave={addInternal} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.client_id} onValueChange={(v) => updateField("client_id", v)}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CompanyDialog type="customer" onSave={addCustomer} />
                  </div>
                </div>
              </div>

              {/* Objetivo + Versão */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <Label>Objetivo *</Label>
                  <Select
                    value={formData.initial_objective}
                    onValueChange={(v) => updateField("initial_objective", v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gerar Escopo Técnico">Gerar Escopo Técnico</SelectItem>
                      <SelectItem value="Gerar Proposta Técnica e Comercial">Gerar Proposta Técnica e Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {showVersionSelect && (
                  <div className="space-y-2">
                    <Label>Versão da Proposta *</Label>
                    <Select
                      value={formData.proposal_version}
                      onValueChange={(v) => updateField("proposal_version", v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basica">Básica (7 seções)</SelectItem>
                        <SelectItem value="Normal">Normal (12 seções)</SelectItem>
                        <SelectItem value="Completa">Completa (15 seções)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Título + Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <Label>Título do Projeto *</Label>
                  <Input
                    placeholder="Ex: Célula Robotizada para Montagem"
                    value={formData.project_title}
                    onChange={(e) => updateField("project_title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Aplicação *</Label>
                  <Select value={formData.application_type} onValueChange={(v) => updateField("application_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {applicationTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição do Escopo *</Label>
                <Textarea
                  placeholder="Descreva a aplicação solicitada, o processo atual e o objetivo do projeto..."
                  value={formData.custom_scope_description}
                  onChange={(e) => updateField("custom_scope_description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* === SEÇÃO 2: PARÂMETROS TÉCNICOS (Colapsável) === */}
            <div className="border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-lg"
              >
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  ⚙️ Parâmetros Técnicos <span className="text-sm font-normal text-muted-foreground">(Opcional)</span>
                </h2>
                {showTechnical ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {showTechnical && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Produção Desejada (pçs/h)</Label>
                      <Input
                        type="number" min={1} placeholder="Ex: 150"
                        value={formData.production_target ?? ""}
                        onChange={(e) => updateField("production_target", e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tempo de Ciclo Alvo (s)</Label>
                      <Input
                        type="number" min={1} placeholder="Ex: 24"
                        value={formData.target_cycle_time ?? ""}
                        onChange={(e) => updateField("target_cycle_time", e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Peso da Peça (kg)</Label>
                      <Input
                        type="number" step="0.1" min={0} placeholder="Ex: 6"
                        value={formData.piece_weight ?? ""}
                        onChange={(e) => updateField("piece_weight", e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Produto</Label>
                      <Input
                        placeholder="Ex: Suporte 6954"
                        value={formData.product_name ?? ""}
                        onChange={(e) => updateField("product_name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensões da Peça (mm)</Label>
                      <Input
                        placeholder="Ex: 300x200x180"
                        value={formData.piece_dimensions ?? ""}
                        onChange={(e) => updateField("piece_dimensions", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Input
                        placeholder="Ex: Aço carbono"
                        value={formData.material ?? ""}
                        onChange={(e) => updateField("material", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Acabamento Superficial</Label>
                      <Input
                        placeholder="Ex: Usinada"
                        value={formData.surface_finish ?? ""}
                        onChange={(e) => updateField("surface_finish", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nível de Automação</Label>
                      <Select value={formData.automation_level ?? "Totalmente automático"} onValueChange={(v) => updateField("automation_level", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {automationLevels.map((a) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Ambiente Operacional</Label>
                      <Input
                        placeholder="Ex: Industrial padrão"
                        value={formData.operational_environment ?? ""}
                        onChange={(e) => updateField("operational_environment", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Turnos de Operação</Label>
                      <Input
                        type="number" min={1} max={3} placeholder="Ex: 3"
                        value={formData.work_shifts ?? ""}
                        onChange={(e) => updateField("work_shifts", e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Temperatura de Operação</Label>
                      <Input
                        placeholder="Ex: Ambiente"
                        value={formData.operating_temperature ?? ""}
                        onChange={(e) => updateField("operating_temperature", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch
                        checked={formData.continuous_operation ?? false}
                        onCheckedChange={(v) => updateField("continuous_operation", v)}
                      />
                      <Label>Operação Contínua</Label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* === SEÇÃO 3: INFRAESTRUTURA (Colapsável) === */}
            <div className="border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setShowInfra(!showInfra)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-lg"
              >
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  🏭 Infraestrutura <span className="text-sm font-normal text-muted-foreground">(Opcional)</span>
                </h2>
                {showInfra ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {showInfra && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Área Disponível (mm)</Label>
                      <Input
                        placeholder="Ex: 2500x8200"
                        value={formData.installation_area_size ?? ""}
                        onChange={(e) => updateField("installation_area_size", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alimentação Elétrica</Label>
                      <Input
                        placeholder="Ex: 380V 3F 60Hz"
                        value={formData.available_power_supply ?? ""}
                        onChange={(e) => updateField("available_power_supply", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ar Comprimido</Label>
                      <Input
                        placeholder="Ex: 6 bar, 200 Nl/min"
                        value={formData.available_compressed_air ?? ""}
                        onChange={(e) => updateField("available_compressed_air", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* === SEÇÃO 4: DADOS COMERCIAIS (Colapsável) === */}
            {showVersionSelect && (
              <div className="border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowCommercial(!showCommercial)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    💰 Dados Comerciais <span className="text-sm font-normal text-muted-foreground">(Opcional)</span>
                  </h2>
                  {showCommercial ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {showCommercial && (
                  <div className="px-4 pb-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Investimento Básico</Label>
                        <Input
                          placeholder="Ex: R$ 150.000 - R$ 250.000"
                          value={formData.investment_range_basic ?? ""}
                          onChange={(e) => updateField("investment_range_basic", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Investimento Intermediário</Label>
                        <Input
                          placeholder="Ex: R$ 300.000 - R$ 500.000"
                          value={formData.investment_range_intermediate ?? ""}
                          onChange={(e) => updateField("investment_range_intermediate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Investimento Otimizado</Label>
                        <Input
                          placeholder="Ex: R$ 600.000 - R$ 900.000"
                          value={formData.investment_range_optimized ?? ""}
                          onChange={(e) => updateField("investment_range_optimized", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Observações */}
            <div className="space-y-2">
              <Label>Observações Adicionais</Label>
              <Textarea
                placeholder="Informações adicionais relevantes..."
                value={formData.observacoes ?? ""}
                onChange={(e) => updateField("observacoes", e.target.value)}
                rows={2}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full h-12 text-lg font-semibold brand-gradient hover:opacity-90 text-primary-foreground"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Cog className="h-5 w-5 animate-spin" /> Gerando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {formData.initial_objective === "Gerar Escopo Técnico"
                    ? "Gerar Escopo Técnico"
                    : "Gerar Proposta Técnica e Comercial"}
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
