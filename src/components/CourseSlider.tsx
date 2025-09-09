import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Course = {
  id: string;
  title: string;
  description: string | null;
  specialization: string | null;
  duration: number | null;
  fee: number | null;
  status: string;
  created_at: string;
  thumbnail_url?: string | null;
};

export default function CourseSlider() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("id,title,description,specialization,duration,fee,status,created_at,thumbnail_url")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!active) return;
      if (error) console.error(error);
      else setCourses(data ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/60 p-6 shadow-sm">
        <p className="text-sm text-gray-500">Loading latest courses…</p>
      </div>
    );
  }
  if (!courses.length) return null;

  return (
    <section className="relative rounded-2xl border border-gray-200/60 p-4 shadow-sm bg-white dark:bg-[rgba(255,255,255,0.03)]">
      <header className="mb-3 flex items-end justify-between">
        <h2 className="font-playfair text-2xl sm:text-3xl">
          Latest <span className="text-[#1d4ed8]">Courses</span>
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scrollByAmount("left")} className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-white/10" aria-label="Scroll left">◀</button>
          <button onClick={() => scrollByAmount("right")} className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-white/10" aria-label="Scroll right">▶</button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent dark:from-[rgba(13,18,27,1)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent dark:from-[rgba(13,18,27,1)]" />

      <div ref={scrollerRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4">
        {courses.map((c) => (
          <Link to={`/courses/${c.id}`} key={c.id} className="w-72 flex-none snap-start" aria-label={`Open ${c.title}`}>
            <article className="h-full rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-[rgba(255,255,255,0.03)]">
              <div className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-gray-100">
                {c.thumbnail_url ? (
                  <img src={c.thumbnail_url} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">Course</div>
                )}
              </div>
              <h3 className="line-clamp-2 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{c.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[#1d4ed8] dark:bg-white/10">{c.specialization ?? "General"}</span>
                <span>{c.duration ? `${c.duration} hrs` : ""}</span>
                <span>{c.fee ? `₹${c.fee}` : ""}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
