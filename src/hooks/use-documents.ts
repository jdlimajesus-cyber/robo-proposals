import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedDocument } from "@/types/project";

export function useDocuments() {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .order("generation_date", { ascending: false });

    if (!error && data) {
      setDocuments(data as unknown as GeneratedDocument[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const saveDocument = async (doc: Partial<GeneratedDocument>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("generated_documents")
      .insert({ ...doc, user_id: user.id } as any)
      .select()
      .single();

    if (!error && data) {
      setDocuments((prev) => [data as unknown as GeneratedDocument, ...prev]);
      return data as unknown as GeneratedDocument;
    }
    return null;
  };

  const updateDocument = async (id: string, updates: Partial<GeneratedDocument>) => {
    const { error } = await supabase
      .from("generated_documents")
      .update(updates as any)
      .eq("id", id);

    if (!error) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    }
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase
      .from("generated_documents")
      .delete()
      .eq("id", id);

    if (!error) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return { documents, loading, saveDocument, updateDocument, deleteDocument, refetch: fetchDocuments };
}
