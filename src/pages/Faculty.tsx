import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import FacultyCard from "../components/FacultyCard";
import SectionHeader from "../components/SectionHeader";
import { motion } from "framer-motion";

type FacultyRow = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url?: string | null;
  // specialization stored either directly or in profiles.metadata JSON
  specialization?: string | null;
  role: string;
};

export default function Faculty() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("");
  const [rows, setRows] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);

  const like = useMemo(() => `%${q.trim()}%`, [q]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Select faculty with a projection for specialization (metadata or column)
      let query = supabase
        .from("profiles")
        .select("id, full_name, bio, avatar_url, role, metadata")
        .eq("role", "faculty");

      if (q.trim()) {
        query = query.or(`full_name.ilike.${like},bio.ilike.${like}`);
      }

      if (spec) {
        // If specialization is stored in metadata JSON
        // filter client-side (Supabase JSON path filter differs per schema)
        const { data, error } = await query;
        if (!error && data) {
          const mapped = (data as any[]).map((d) => ({
            id: d.id,
            full_name: d.full_name,
            bio: d.bio,
            avatar_url: d.avatar_url,
            specialization: d.metadata?.specialization ?? null,
            role: d.role
          })) as FacultyRow[];
          setRows(mapped.filter(r => (r.specialization ?? "").toLowerCase() === spec.toLowerCase()));
        } else setRows([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query;
      if (!error && data) {
        const mapped = (data as any[]).map((d) => ({
          id: d.id,
          full_name: d.full_name,
          bio: d.bio,
          avatar_url: d.avatar_url,
          specialization: d.metadata?.specialization ?? null,
          role: d.role
        })) as FacultyRow[];
        setRows(mapped);
      } else setRows([]);
      setLoading(false);
    })();
  }, [q, like, spec]);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader
          eyebrow="Faculty"
          title="Meet Our Teaching Team"
          subtitle="All instructors are active practitioners. We publish only real profiles — add them via Supabase once verified."
        />

        {/* Filters */}
        <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search faculty…"
                className="w-full rounded-xl border px-10 py-2 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <select
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Specializations</option>
              <option value="Constitutional Law">Constitutional Law</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Human Rights">Human Rights</option>
            </select>

            <button onClick={() => { setQ(""); setSpec(""); }}
              className="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border bg-white" />
            ))
          ) : rows.length === 0 ? (
            <div className="col-span-full rounded-2xl border p-6 text-center text-gray-500">
              No faculty found. Add real profiles in Supabase › profiles (role="faculty").
            </div>
          ) : (
            rows.map((f, idx) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx*0.03 }}>
                <FacultyCard {...f} />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
