import { useState } from "react";
import { supabase } from "../lib/supabase";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email,setEmail] = useState(""); 
  const [password,setPassword] = useState("");
  const [err,setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErr(error.message);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from("profiles").select("role").eq("id", user!.id).maybeSingle();
    if (data?.role === "admin") nav("/admin/dashboard");
    else if (data?.role === "faculty") nav("/faculty/dashboard");
    else nav("/student/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl mb-6">Login</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="bg-brand-700 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}

