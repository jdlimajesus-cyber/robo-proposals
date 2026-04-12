import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Company } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompanyDialogProps {
  type: "internal" | "customer";
  onSave: (company: Omit<Company, "id">) => Promise<Company | null>;
}

export function CompanyDialog({ type, onSave }: CompanyDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [authorizedName, setAuthorizedName] = useState("");
  const [authorizedTitle, setAuthorizedTitle] = useState("");
  const [authorizedCrea, setAuthorizedCrea] = useState("");
  const [authorizedCpf, setAuthorizedCpf] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    await onSave({
      company_type: type,
      name: name.trim(),
      legal_name: legalName || undefined,
      cnpj: cnpj || undefined,
      address: address || undefined,
      city: city || undefined,
      state: state || undefined,
      contact_info: contactInfo || undefined,
      default_payment_terms: paymentTerms || undefined,
      default_warranty_period: warrantyPeriod || undefined,
      authorized_person_name: authorizedName || undefined,
      authorized_person_title: authorizedTitle || undefined,
      authorized_person_crea: authorizedCrea || undefined,
      authorized_person_cpf: authorizedCpf || undefined,
    });
    setOpen(false);
    resetFields();
  };

  const resetFields = () => {
    setName(""); setLegalName(""); setCnpj(""); setAddress(""); setCity(""); setState("");
    setContactInfo(""); setPaymentTerms(""); setWarrantyPeriod("");
    setAuthorizedName(""); setAuthorizedTitle(""); setAuthorizedCrea(""); setAuthorizedCpf("");
  };

  const isInternal = type === "internal";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isInternal ? "Cadastrar Sua Empresa" : "Cadastrar Cliente"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Fantasia *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da empresa" />
              </div>
              <div className="space-y-2">
                <Label>Razão Social</Label>
                <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Razão social completa" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="Ex: 12.345.678/0001-90" />
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço completo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="São Paulo" />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contato (Telefone / Email)</Label>
              <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="(11) 3333-4444 / email@empresa.com" />
            </div>

            {isInternal && (
              <>
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">👤 Responsável Técnico (Assinatura)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input value={authorizedName} onChange={(e) => setAuthorizedName(e.target.value)} placeholder="Eng. João da Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input value={authorizedTitle} onChange={(e) => setAuthorizedTitle(e.target.value)} placeholder="Diretor Técnico" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label>CREA</Label>
                      <Input value={authorizedCrea} onChange={(e) => setAuthorizedCrea(e.target.value)} placeholder="123456-D/SP" />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF</Label>
                      <Input value={authorizedCpf} onChange={(e) => setAuthorizedCpf(e.target.value)} placeholder="123.456.789-00" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isInternal && (
              <>
                <div className="space-y-2">
                  <Label>Condições de Pagamento Padrão</Label>
                  <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Ex: 50/30/20 - Assinatura/80%/Entrega" />
                </div>
                <div className="space-y-2">
                  <Label>Garantia Padrão</Label>
                  <Input value={warrantyPeriod} onChange={(e) => setWarrantyPeriod(e.target.value)} placeholder="Ex: 24 meses" />
                </div>
              </>
            )}

            <Button onClick={handleSave} disabled={!name.trim()} className="w-full">
              Salvar
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
