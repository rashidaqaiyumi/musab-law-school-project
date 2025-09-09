import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type FAQ = { id: string; question: string; answer: string };

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id,question,answer")
        .order("sort_order", { ascending: true });
      if (!error && data) setFaqs(data);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-playfair text-3xl">Frequently Asked Questions</h1>

      {loading ? (
        <div className="mt-6 rounded-2xl border p-6 text-gray-500">Loading…</div>
      ) : faqs.length === 0 ? (
        <div className="mt-6 rounded-2xl border p-6 text-gray-500">No FAQs yet.</div>
      ) : (
        <div className="mt-6 divide-y rounded-2xl border">
          {faqs.map((f) => (
            <details key={f.id} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="font-medium">{f.question}</span>
                <span className="text-gray-400 group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
