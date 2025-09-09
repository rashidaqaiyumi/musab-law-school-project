import { useState } from "react";
import { supabase } from "../lib/supabase";

import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [email,setEmail] = useState(""); 
  const [password,setPassword] = useState("");
  const [fullName,setFullName] = useState("");
  const [role,setRole] = useState<"student"|"faculty">("student");
  const [err,setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    });
    if (error) return setErr(error.message);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id, email, full_name: fullName,
        role: role === "faculty" ? "faculty" : "student"
      }, { onConflict: "id" });
    }
    nav("/auth/login");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl mb-6">Create account</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input className="w-full border rounded px-3 py-2" placeholder="Full name"
               value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-sm">Role:</label>
          <select className="border rounded px-2 py-1" value={role} onChange={e=>setRole(e.target.value as any)}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="bg-brand-700 text-white px-4 py-2 rounded">Sign up</button>
      </form>
    </div>
  );
}

