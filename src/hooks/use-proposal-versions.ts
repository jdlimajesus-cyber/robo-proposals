import { useState, useCallback } from "react";

export interface ProposalVersion {
  id: number;
  content: string;
  timestamp: string;
  type: "generated" | "edited" | "manual";
  title: string;
}

const MAX_VERSIONS = 10;

function getStorageKey(proposalId: string) {
  return `proposal_${proposalId}_versions`;
}

function loadVersions(proposalId: string): ProposalVersion[] {
  try {
    const raw = localStorage.getItem(getStorageKey(proposalId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistVersions(proposalId: string, versions: ProposalVersion[]) {
  localStorage.setItem(getStorageKey(proposalId), JSON.stringify(versions));
}

export function useProposalVersions(proposalId: string) {
  const [versions, setVersions] = useState<ProposalVersion[]>(() =>
    loadVersions(proposalId)
  );
  const [activeVersionId, setActiveVersionId] = useState<number | null>(
    () => loadVersions(proposalId)[0]?.id ?? null
  );

  const saveVersion = useCallback(
    (content: string, type: ProposalVersion["type"] = "edited") => {
      const newVersion: ProposalVersion = {
        id: Date.now(),
        content,
        timestamp: new Date().toISOString(),
        type,
        title: `Versão ${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR")}`,
      };

      setVersions((prev) => {
        const updated = [newVersion, ...prev].slice(0, MAX_VERSIONS);
        persistVersions(proposalId, updated);
        return updated;
      });

      setActiveVersionId(newVersion.id);
      return newVersion.id;
    },
    [proposalId]
  );

  const loadVersion = useCallback(
    (versionId: number): string | null => {
      const v = versions.find((v) => v.id === versionId);
      if (v) {
        setActiveVersionId(versionId);
        return v.content;
      }
      return null;
    },
    [versions]
  );

  const deleteVersion = useCallback(
    (versionId: number) => {
      setVersions((prev) => {
        const updated = prev.filter((v) => v.id !== versionId);
        persistVersions(proposalId, updated);
        return updated;
      });
    },
    [proposalId]
  );

  const getLatestContent = useCallback((): string | null => {
    const v = loadVersions(proposalId);
    return v[0]?.content ?? null;
  }, [proposalId]);

  return {
    versions,
    activeVersionId,
    saveVersion,
    loadVersion,
    deleteVersion,
    getLatestContent,
  };
}
