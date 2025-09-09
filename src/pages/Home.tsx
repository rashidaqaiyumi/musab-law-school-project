import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

type Course = {
  id: string;
  title: string;
  description: string | null;
  specialization: string | null;
  duration: number | null;
  fee: number | null;
  thumbnail_url?: string | null;
  created_at: string;
  status: string;
};

type SiteSettings = {
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_cta_text?: string | null;
  hero_image_url?: string | null;
};

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await supabase.from("site_settings").select("*").limit(1).single();
      if (!s.error && s.data) {
        setSettings({
          hero_title: s.data.hero_title ?? "Musab Practical Law School",
          hero_subtitle:
            s.data.hero_subtitle ??
            "Professional legal education from Hyderabad’s premier faculty. Learn practical law skills through our comprehensive e-learning platform.",
          hero_cta_text: s.data.hero_cta_text ?? "Browse Courses",
          hero_image_url:
            s.data.hero_image_url ??
            "https://images.unsplash.com/photo-1593113598332-cc1ab3a5d0c7?q=80&w=1600&auto=format&fit=crop",
        });
      } else {
        setSettings({
          hero_title: "Musab Practical Law School",
          hero_subtitle:
            "Professional legal education from Hyderabad’s premier faculty. Learn practical law skills through our comprehensive e-learning platform.",
          hero_cta_text: "Browse Courses",
          hero_image_url:
            "https://images.unsplash.com/photo-1593113598332-cc1ab3a5d0c7?q=80&w=1600&auto=format&fit=crop",
        });
      }

      const c = await supabase
        .from("courses")
        .select("id,title,description,specialization,duration,fee,thumbnail_url,created_at,status")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(9);
      if (!c.error && c.data) setCourses(c.data);
      setLoading(false);
    })();
  }, []);

  return (
    <main>
      {/* HERO full-bleed background image with gradient for contrast */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.55), rgba(29,78,216,.45)), url('${settings?.hero_image_url}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl leading-tight text-white sm:text-6xl"
          >
            {settings?.hero_title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-3xl text-lg text-slate-100"
          >
            {settings?.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/courses"
              className="flex items-center gap-2 rounded-2xl bg-[#1d4ed8] px-5 py-3 text-white shadow-md transition hover:opacity-90"
            >
              <span>📚</span> {settings?.hero_cta_text ?? "Browse Courses"}
            </Link>
            <Link
              to="/faculty"
              className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/10 px-5 py-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              <span>👥</span> Meet Our Faculty
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-2 text-center font-playfair text-3xl text-gray-900">Why Choose Our Platform?</h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-gray-600">
          Learn from industry experts through our comprehensive e-learning platform designed for legal professionals.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard icon="👩‍⚖️" title="Expert Faculty" text="Practicing lawyers, judges, and scholars with decades of experience." />
          <FeatureCard icon="▶️" title="Flexible Learning" text="Self-paced with 24/7 access to materials, videos, and interactive content." />
          <FeatureCard icon="🎖️" title="Professional Recognition" text="Certificates and credentials valued by legal employers." />
        </div>
      </section>

      {/* POPULAR / FEATURED COURSES */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-2 text-center font-playfair text-3xl text-gray-900">Popular Courses</h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-gray-600">
          Discover our most sought-after courses taught by industry experts.
        </p>

        {loading ? (
          <div className="rounded-2xl border p-6 text-center text-gray-500">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border p-6 text-center text-gray-500">
            No published courses yet. Publish a few to display here.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, idx) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.04 * idx }}
                className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 h-40 w-full overflow-hidden rounded-xl bg-gray-100">
                  {c.thumbnail_url ? (
                    <img src={c.thumbnail_url} alt={c.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm text-gray-400">Course</div>
                  )}
                </div>
                <h3 className="mb-1 line-clamp-2 text-2xl font-semibold text-gray-900">{c.title}</h3>
                <p className="mb-3 line-clamp-3 text-gray-600">{c.description}</p>
                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span className="rounded-full bg-gray-100 px-2 py-1">{c.specialization ?? "General"}</span>
                  {c.duration ? <span>• {c.duration} weeks</span> : null}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[#1d4ed8]">{c.fee ? `₹${c.fee}` : ""}</div>
                  <Link to={`/courses/${c.id}`} className="rounded-xl bg-[#1d4ed8] px-4 py-2 text-sm text-white transition hover:opacity-90">
                    Enroll Now
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* CTA STRIP */}
      <section className="bg-[#1d4ed8] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-3 font-playfair text-4xl">Ready to Start Your Legal Journey?</h2>
          <p className="mx-auto mb-8 max-w-3xl text-blue-100">
            Join learners who chose our platform for practical, career-focused legal education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="rounded-2xl bg-white px-6 py-3 text-[#0b0f19] transition hover:opacity-90">
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="rounded-2xl border border-white/70 bg-white/10 px-6 py-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm"
    >
      <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl">
        <span aria-hidden>{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </motion.div>
  );
}

