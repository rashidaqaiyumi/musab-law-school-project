import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type ProfileRow = { id: string; full_name: string | null; role: "student" | "faculty" | "admin" };

export function useProfile() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setProfile(null); setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("id, full_name, role").eq("id", user.id).single();
      setProfile(data as ProfileRow | null);
      setLoading(false);
    })();
  }, []);

  return { profile, loading };
}
