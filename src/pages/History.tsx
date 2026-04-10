import { useState, useEffect } from "react";
import { useDocuments } from "@/hooks/use-documents";
import { useCompanies } from "@/hooks/use-companies";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, Download, RefreshCw, Trash2, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProposalPreview } from "@/components/ProposalPreview";
import { toast } from "sonner";

const History = () => {
  const navigate = useNavigate();
  const { documents, loading, deleteDocument } = useDocuments();
  const { companies: customers } = useCompanies("customer");
  const [search, setSearch] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  const filtered = documents.filter((d) => {
    if (search && !d.project_title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterClient !== "all" && d.client_id !== filterClient) return false;
    if (filterType !== "all" && d.document_type !== filterType) return false;
    return true;
  });

  const viewingDocument = viewingDoc ? documents.find((d) => d.id === viewingDoc) : null;

  if (viewingDocument && viewingDocument.output_html) {
    return (
      <ProposalPreview
        html={viewingDocument.output_html}
        onBack={() => setViewingDoc(null)}
        proposalId={viewingDocument.id}
      />
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este documento?")) {
      await deleteDocument(id);
      toast.success("Documento excluído");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="brand-gradient py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-primary-foreground gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <FileText className="h-6 w-6" /> Histórico de Documentos
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-sm text-muted-foreground">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-[200px] space-y-1">
              <label className="text-sm text-muted-foreground">Cliente</label>
              <Select value={filterClient} onValueChange={setFilterClient}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px] space-y-1">
              <label className="text-sm text-muted-foreground">Tipo</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="escopo">Escopo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Documents list */}
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum documento encontrado.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <Card key={doc.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      doc.document_type === "proposta"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}>
                      {doc.document_type === "proposta" ? "Proposta" : "Escopo"}
                    </span>
                    <span className="text-xs text-muted-foreground">{doc.document_version}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.generation_date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="font-medium text-foreground truncate">{doc.project_title}</p>
                  {doc.output_file_name && (
                    <p className="text-xs text-muted-foreground truncate">{doc.output_file_name}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingDoc(doc.id)}
                    disabled={!doc.output_html}
                    className="gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
