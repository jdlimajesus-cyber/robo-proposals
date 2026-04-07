import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Clock, Trash2 } from "lucide-react";
import { ProposalVersion } from "@/hooks/use-proposal-versions";

interface VersionHistoryPanelProps {
  versions: ProposalVersion[];
  activeVersionId: number | null;
  onLoadVersion: (id: number) => void;
  onDeleteVersion: (id: number) => void;
  onClose: () => void;
  onSaveManual: () => void;
}

const typeLabels: Record<string, string> = {
  generated: "Gerada",
  edited: "Editada",
  manual: "Salva manualmente",
};

export function VersionHistoryPanel({
  versions,
  activeVersionId,
  onLoadVersion,
  onDeleteVersion,
  onClose,
  onSaveManual,
}: VersionHistoryPanelProps) {
  return (
    <div className="fixed right-0 top-0 w-80 h-screen bg-card border-l border-border shadow-xl z-50 flex flex-col animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" /> Histórico de Versões
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/80 h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {versions.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nenhuma versão salva.</p>
        ) : (
          versions.map((v) => (
            <div
              key={v.id}
              onClick={() => onLoadVersion(v.id)}
              className={`px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted ${
                v.id === activeVersionId ? "bg-primary/10 border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">{v.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVersion(v.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">{typeLabels[v.type] || v.type}</span>
            </div>
          ))
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted">
        <Button onClick={onSaveManual} className="w-full brand-gradient text-primary-foreground">
          Salvar Versão Atual
        </Button>
      </div>
    </div>
  );
}
