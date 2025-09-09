import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SectionHeader from "../components/SectionHeader";
import { motion } from "framer-motion";

type TRow = {
  id: string;
  name: string | null;
  role: string | null;
  content: string | null;
  rating: number | null;
  status: string;
  created_at: string;
};

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1 text-[#1d4ed8]">
      {Array.from({ length: Math.max(0, Math.min(5, n)) }).map((_, i) => (
        <span key={i}>★</span>
      ))}
      {Array.from({ length: 5 - Math.max(0, Math.min(5, n)) }).map((_, i) => (
        <span key={i} className="text-gray-300">★</span>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [rows, setRows] = useState<TRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id,name,role,content,rating,status,created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(24);
      if (!error && data) setRows(data as TRow[]);
      else setRows([]);
    })();
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Learners Say"
          subtitle="Real reviews from enrolled students and industry colleagues."
        />

        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl border p-6 text-center text-gray-500">
              No testimonials yet — add real ones in Supabase › testimonials (status="published").
            </div>
          ) : rows.map((t, idx) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (idx % 6)*0.03 }}
              className="mb-6 break-inside-avoid rounded-2xl border bg-white p-5 shadow-sm"
            >
              <Stars n={t.rating ?? 5} />
              <p className="mt-3 text-gray-800">{t.content}</p>
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{t.name ?? "Anonymous"}</span>
                {t.role ? ` • ${t.role}` : null}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
