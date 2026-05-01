import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/project";

export function useCompanies(type: "internal" | "customer") {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("company_type", type)
      .order("name");

    if (!error && data) {
      setCompanies(data as unknown as Company[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [type]);

  const addCompany = async (company: Omit<Company, "id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("companies")
      .insert({ ...company, user_id: user.id } as any)
      .select()
      .single();

    if (!error && data) {
      setCompanies((prev) => [...prev, data as unknown as Company]);
      return data as unknown as Company;
    }
    return null;
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    const { error } = await supabase.from("companies").update(updates as any).eq("id", id);
    if (!error) {
      setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
  };

  return { companies, loading, addCompany, updateCompany, refetch: fetchCompanies };
}
