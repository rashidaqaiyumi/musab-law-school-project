import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | "ok" | "err">(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !subject || !message) return setDone("err");
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([{ name, email, subject, message }]);
    setLoading(false);
    if (error) setDone("err"); else { setDone("ok"); setName(""); setEmail(""); setSubject(""); setMessage(""); }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-playfair text-3xl">Contact Support</h1>
      <p className="mt-2 text-gray-600">We usually reply within one business day.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border p-6 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div><label className="text-sm text-gray-600">Your name</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div><label className="text-sm text-gray-600">Email</label>
            <input type="email" className="mt-1 w-full rounded-xl border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
        </div>
        <div><label className="text-sm text-gray-600">Subject</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={subject} onChange={e=>setSubject(e.target.value)} />
        </div>
        <div><label className="text-sm text-gray-600">Message</label>
          <textarea rows={6} className="mt-1 w-full rounded-xl border px-3 py-2" value={message} onChange={e=>setMessage(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <button disabled={loading} className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-white disabled:opacity-60">
            {loading ? "Sending…" : "Send Message"}
          </button>
          {done==="ok" && <span className="text-sm text-green-700">Thanks! We’ll get back to you soon.</span>}
          {done==="err" && <span className="text-sm text-red-600">Please fill all fields or try again.</span>}
        </div>
      </form>
    </main>
  );
}
