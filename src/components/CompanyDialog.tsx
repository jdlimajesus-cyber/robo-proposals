import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Company } from "@/types/project";

interface CompanyDialogProps {
  type: "internal" | "customer";
  onSave: (company: Omit<Company, "id">) => Promise<Company | null>;
}

export function CompanyDialog({ type, onSave }: CompanyDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [address, setAddress] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    await onSave({
      company_type: type,
      name: name.trim(),
      legal_name: legalName || undefined,
      address: address || undefined,
      contact_info: contactInfo || undefined,
      default_payment_terms: paymentTerms || undefined,
      default_warranty_period: warrantyPeriod || undefined,
    });
    setOpen(false);
    setName("");
    setLegalName("");
    setAddress("");
    setContactInfo("");
    setPaymentTerms("");
    setWarrantyPeriod("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "internal" ? "Cadastrar Sua Empresa" : "Cadastrar Cliente"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da empresa" />
          </div>
          <div className="space-y-2">
            <Label>Razão Social</Label>
            <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Razão social" />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço completo" />
          </div>
          <div className="space-y-2">
            <Label>Contato</Label>
            <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Telefone / email" />
          </div>
          {type === "customer" && (
            <>
              <div className="space-y-2">
                <Label>Condições de Pagamento Padrão</Label>
                <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Ex: 30/60/90 dias" />
              </div>
              <div className="space-y-2">
                <Label>Garantia Padrão</Label>
                <Input value={warrantyPeriod} onChange={(e) => setWarrantyPeriod(e.target.value)} placeholder="Ex: 12 meses" />
              </div>
            </>
          )}
          <Button onClick={handleSave} disabled={!name.trim()} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
