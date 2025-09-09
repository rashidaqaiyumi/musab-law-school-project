import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type Course = {
  id: string;
  title: string;
  description: string | null;
  specialization: string | null;
  degree_type: string | null;
  duration: number | null;
  fee: number | null;
  language: string | null;
  eligibility: string | null;
  thumbnail_url?: string | null;
  faculty_id: string | null;
  status: string;
};

type Lesson = {
  id: string;
  title: string;
  position: number;
  content_type: string;
  content_url: string | null;
  content_text: string | null;
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<(Course & { faculty_name?: string | null }) | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "syllabus" | "reviews">("overview");
  const [enrolling, setEnrolling] = useState(false);

  const price = useMemo(() => course?.fee ?? 0, [course?.fee]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // use the view to get faculty_name
      const c = await supabase
        .from("v_courses_with_faculty")
        .select("*")
        .eq("id", id!)
        .limit(1)
        .single();

      if (!c.error && c.data) {
        setCourse(c.data as any);
        // lessons (only titles/positions for public; actual content is protected by RLS)
        const l = await supabase
          .from("lessons")
          .select("id,title,position,content_type,content_url,content_text")
          .eq("course_id", id!)
          .order("position", { ascending: true });
        if (!l.error && l.data) setLessons(l.data);
      } else {
        navigate("/courses");
        return;
      }
      setLoading(false);
    })();
  }, [id, navigate]);

  async function handleEnroll() {
    setEnrolling(true);
    // 1) Create an order (pending)
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert("Please login to enroll.");
      setEnrolling(false);
      navigate("/login");
      return;
    }

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([{ user_id: user.id, course_id: id, amount: price, status: "pending" }])
      .select("id")
      .single();

    if (orderErr) { console.error(orderErr); setEnrolling(false); return; }

    // 2) (Stub) pretend payment completed successfully
    await new Promise(res => setTimeout(res, 900));

    // 3) Mark order paid and create enrollment
    const { error: updErr } = await supabase.from("orders").update({ status: "paid" }).eq("id", order!.id);
    if (updErr) { console.error(updErr); setEnrolling(false); return; }

    const { error: enrErr } = await supabase.from("enrollments")
      .insert([{ student_id: user.id, course_id: id }]);
    if (enrErr) { console.error(enrErr); setEnrolling(false); return; }

    setEnrolling(false);
    alert("Enrolled successfully! You can now access lessons.");
    // Optionally redirect to student dashboard
    // navigate("/student/dashboard");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {loading || !course ? (
        <div className="rounded-2xl border p-6 text-gray-500">Loading…</div>
      ) : (
        <>
          {/* Header */}
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div>
              <h1 className="font-playfair text-4xl text-gray-900">{course.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {course.specialization && <span className="rounded-full bg-gray-100 px-2 py-1">{course.specialization}</span>}
                {course.degree_type && <span>{course.degree_type}</span>}
                {course.duration ? <span>• {course.duration} weeks</span> : null}
                {course.language ? <span>• {course.language}</span> : null}
                {course.faculty_name ? <span>• by {course.faculty_name}</span> : null}
              </div>
              {course.thumbnail_url && (
                <div className="mt-4 overflow-hidden rounded-2xl">
                  <img src={course.thumbnail_url} className="h-64 w-full object-cover" />
                </div>
              )}
            </div>

            {/* Enroll box */}
            <aside className="h-fit rounded-2xl border p-5 shadow-sm">
              <div className="text-sm text-gray-500">Course fee</div>
              <div className="mt-1 text-4xl font-bold text-[#1d4ed8]">{price ? `₹${price}` : "Free"}</div>

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="mt-4 w-full rounded-xl bg-[#1d4ed8] px-4 py-3 text-white hover:opacity-90 disabled:opacity-60"
              >
                {enrolling ? "Processing…" : "Enroll Now"}
              </button>

              <div className="mt-4 text-xs text-gray-500">
                Payments are sandboxed now. On success, your enrollment is created automatically.
              </div>
            </aside>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex gap-2 border-b">
              {(["overview","syllabus","reviews"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-t-xl px-4 py-2 text-sm ${
                    tab===t ? "bg-white text-[#1d4ed8] border-x border-t" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t[0].toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="rounded-b-xl border-x border-b p-5">
                <h3 className="mb-2 text-lg font-semibold">About this course</h3>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {course.eligibility && (
                    <div className="rounded-xl border p-4">
                      <p className="text-sm text-gray-500">Eligibility</p>
                      <p className="mt-1 text-gray-800">{course.eligibility}</p>
                    </div>
                  )}
                  {course.language && (
                    <div className="rounded-xl border p-4">
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="mt-1 text-gray-800">{course.language}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "syllabus" && (
              <div className="rounded-b-xl border-x border-b p-5">
                {lessons.length === 0 ? (
                  <div className="text-gray-500">Syllabus will be available soon.</div>
                ) : (
                  <ol className="space-y-2">
                    {lessons.map((l) => (
                      <li key={l.id} className="rounded-xl border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{l.position}. {l.title}</div>
                          <span className="text-xs text-gray-500">{l.content_type}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="mt-4 text-sm text-gray-500">
                  Full lesson content is accessible after enrollment per RLS.
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div className="rounded-b-xl border-x border-b p-5">
                <div className="text-gray-500">Reviews UI coming next (rating + add review for enrolled students).</div>
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="mt-8">
            <Link to="/courses" className="text-sm text-[#1d4ed8] hover:underline">← Back to courses</Link>
          </div>
        </>
      )}
    </main>
  );
}
