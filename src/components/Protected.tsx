import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Role = "student" | "faculty" | "admin";

export function Protected({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setOk(false); setLoading(false); return; }
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (error) { console.error(error); setOk(false); }
      else setOk(!!data && allow.includes((data.role as Role) ?? "student"));
      setLoading(false);
    })();
  }, [allow]);

  if (loading) return <div className="p-8">Checking access…</div>;
  if (!ok) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}

