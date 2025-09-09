import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import SectionHeader from "../components/SectionHeader";
import { motion } from "framer-motion";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  author_name: string | null;
  cover_url?: string | null;
  status: string;
  published_at: string | null;
};

const PAGE_SIZE = 9;

export default function LegalInsights() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const like = useMemo(() => `%${q.trim()}%`, [q]);

  useEffect(() => { setPage(1); }, [q]);

  useEffect(() => {
    (async () => {
      let query = supabase
        .from("insights")
        .select("id,title,excerpt,author_name,cover_url,status,published_at", { count: "exact" })
        .eq("status","published")
        .order("published_at", { ascending: false })
        .range((page-1)*PAGE_SIZE, page*PAGE_SIZE-1);

      if (q.trim()) query = query.or(`title.ilike.${like},excerpt.ilike.${like},author_name.ilike.${like}`);

      const { data, error, count } = await query;
      if (!error) { setRows((data as Post[]) ?? []); setTotal(count ?? 0); } else { setRows([]); setTotal(0); }
    })();
  }, [q, like, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader
          eyebrow="Legal Insights"
          title="Research & Thought Leadership"
          subtitle="Real articles written by your verified faculty and contributors."
        />

        {/* Search */}
        <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="relative sm:w-1/2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-xl border px-10 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.length === 0 ? (
            <div className="col-span-full rounded-2xl border p-6 text-center text-gray-500">
              No published posts yet — add real content in Supabase › insights (status="published").
            </div>
          ) : rows.map((p, idx) => (
            <motion.article key={p.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx*0.03 }}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="mb-4 h-28 rounded-xl bg-gray-50 grid place-items-center text-gray-400">
                {/* cover could go here when you start using it */}
                📰
              </div>
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-3">{p.excerpt}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>{p.author_name ?? "Contributor"}</span>
                {p.published_at && <time>{new Date(p.published_at).toLocaleDateString()}</time>}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="rounded-lg border px-3 py-1 disabled:opacity-50">Prev</button>
            <span className="text-sm text-gray-600">Page <span className="font-medium text-gray-900">{page}</span> / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="rounded-lg border px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        )}
      </section>
    </main>
  );
}
