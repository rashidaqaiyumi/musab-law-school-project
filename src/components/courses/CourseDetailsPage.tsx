// src/pages/courses/CourseDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type CourseVM = {
  id: string;
  title: string;
  description: string | null;
  syllabus: string | null;
  outcomes: string | null;
  price: number | null;
  duration_weeks: number | null;
  level: string | null;
  language: string | null;
  hero_image_url: string | null;
};

type Section = { id: string; title: string; position: number };
type Lesson = {
  id: string;
  section_id: string;
  title: string;
  duration_minutes: number | null;
  free_preview: boolean;
  position: number;
};

export default function CourseDetails() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseVM | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!courseId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1) Course (select * so we don't break if columns are missing)
        const { data: raw, error: courseErr } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .maybeSingle();

        if (courseErr) throw courseErr;

        if (!raw) {
          if (mounted) setCourse(null);
          return;
        }

        // Backward-compat mapping
        const vm: CourseVM = {
          id: raw.id,
          title: raw.title,
          description: raw.description ?? null,
          syllabus: raw.syllabus ?? null,
          outcomes: raw.outcomes ?? null,
          price:
            raw.price != null
              ? Number(raw.price)
              : raw.fee != null
              ? Number(raw.fee)
              : null,
          duration_weeks:
            raw.duration_weeks != null
              ? Number(raw.duration_weeks)
              : raw.duration != null
              ? Number(raw.duration)
              : null,
          level: raw.level ?? raw.specialization ?? null,
          language: raw.language ?? null,
          hero_image_url:
            raw.hero_image_url ??
            raw.banner_url ??
            raw.image_url ??
            null,
        };

        // 2) Sections
        const { data: s, error: secErr } = await supabase
          .from("course_sections")
          .select("id,title,position")
          .eq("course_id", courseId)
          .order("position", { ascending: true });

        if (secErr) {
          // If table doesn't exist yet, fall back to none
          console.warn("course_sections warning:", secErr.message);
        }

        // 3) Lessons (only if we actually have sections)
        let l: Lesson[] = [];
        if (s && s.length > 0) {
          const secIds = s.map((x) => x.id);
          const { data: lx, error: lesErr } = await supabase
            .from("course_lessons")
            .select("id,section_id,title,duration_minutes,free_preview,position")
            .in("section_id", secIds)
            .order("position", { ascending: true });
          if (lesErr) {
            console.warn("course_lessons warning:", lesErr.message);
          } else {
            l = lx ?? [];
          }
        }

        if (!mounted) return;
        setCourse(vm);
        setSections(s ?? []);
        setLessons(l ?? []);
      } catch (err: any) {
        console.error("CourseDetails error:", err?.message || err);
        if (mounted) {
          setCourse(null);
          setSections([]);
          setLessons([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  const groupedLessons = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    for (const sec of sections) map[sec.id] = [];
    for (const le of lessons) (map[le.section_id] ??= []).push(le);
    return map;
  }, [sections, lessons]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) {
        navigate("/login", { state: { from: `/course/${courseId}` } });
        return;
      }
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: uid, course_id: courseId });
      if (error) throw error;
      navigate("/student/enrolled-courses");
    } catch (err: any) {
      console.error(err?.message || err);
      alert("Could not enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }

  // UI
  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-lg">Course not found.</p>
        <Link to="/courses" className="text-blue-600 underline">Back to courses</Link>
      </div>
    );
  }

  const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="w-full h-[340px] md:h-[420px] bg-slate-100 overflow-hidden">
        {course.hero_image_url ? (
          <img src={course.hero_image_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-500">No Image</div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[2fr_1fr] gap-8">
        {/* Main */}
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl">{course.title}</h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
            {typeof course.price === "number" && (
              <span className="px-3 py-1 rounded-full bg-slate-100 border">
                {course.price > 0 ? inr.format(Number(course.price)) : "Free"}
              </span>
            )}
            {course.level && <span className="px-3 py-1 rounded-full bg-slate-100 border">{course.level}</span>}
            {course.language && <span className="px-3 py-1 rounded-full bg-slate-100 border">{course.language}</span>}
            {typeof course.duration_weeks === "number" && (
              <span className="px-3 py-1 rounded-full bg-slate-100 border">{course.duration_weeks} weeks</span>
            )}
          </div>

          {course.description && (
            <section className="mt-8">
              <h2 className="font-semibold text-xl mb-2">Course Description</h2>
              <p className="leading-7 text-slate-700 whitespace-pre-line">{course.description}</p>
            </section>
          )}

          {course.outcomes && (
            <section className="mt-8">
              <h2 className="font-semibold text-xl mb-2">Key Concepts Covered</h2>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                {course.outcomes.split("\n").map((line: string, i: number) => (
                  <li key={i}>{line.trim()}</li>
                ))}
              </ul>
            </section>
          )}

          {course.syllabus && (
            <section className="mt-8">
              <h2 className="font-semibold text-xl mb-2">Syllabus</h2>
              <p className="leading-7 text-slate-700 whitespace-pre-line">{course.syllabus}</p>
            </section>
          )}

          {sections.length > 0 && (
            <section className="mt-10">
              <h2 className="font-semibold text-xl mb-4">Course Content</h2>
              <div className="space-y-3">
                {sections.map((sec) => (
                  <div key={sec.id} className="border rounded-xl">
                    <div className="px-4 py-3 font-medium bg-slate-50 rounded-t-xl">{sec.title}</div>
                    <div className="divide-y">
                      {(groupedLessons[sec.id] || []).map((le) => (
                        <div key={le.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="text-sm">{le.title}</div>
                          <div className="text-xs text-slate-500">
                            {le.duration_minutes ? `${le.duration_minutes} min` : ""}
                            {le.free_preview ? (
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700">Preview</span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20 h-fit">
          <div className="border rounded-2xl p-5 shadow-sm bg-white">
            <div className="text-2xl font-semibold">
              {typeof course.price === "number"
                ? course.price > 0 ? inr.format(Number(course.price)) : "Free"
                : "Free"}
            </div>
            <div className="text-sm text-slate-600 mt-1">One-time purchase</div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full mt-5 rounded-xl bg-blue-600 text-white px-4 py-3 hover:opacity-95 disabled:opacity-70"
            >
              {enrolling ? "Enrolling…" : "Enroll Now"}
            </button>

            <ul className="mt-5 space-y-1 text-sm text-slate-700">
              {course.duration_weeks != null && <li>Duration: {course.duration_weeks} weeks</li>}
              {course.level && <li>Level: {course.level}</li>}
              {course.language && <li>Language: {course.language}</li>}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
