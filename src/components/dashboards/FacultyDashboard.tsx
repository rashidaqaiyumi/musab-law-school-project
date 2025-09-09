import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Course = { id: string; title: string; status: string; specialization: string | null; level: string | null; mode: string | null; };
type Enroll = { course_id: string; title: string; enrollment_id: string; created_at: string; student_name: string | null };

export default function FacultyDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolls, setEnrolls] = useState<Enroll[]>([]);
  const [title, setTitle] = useState("");

  async function refresh() {
    const { data: me } = await supabase.auth.getUser();
    if (!me.user) return;
    const { data: cs } = await supabase
      .from("courses")
      .select("id, title, status, specialization, level, mode")
      .eq("faculty_id", me.user.id)
      .order("created_at", { ascending: false });
    setCourses((cs ?? []) as Course[]);

    const { data: en } = await supabase
      .from("v_faculty_course_enrollments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setEnrolls((en ?? []) as Enroll[]);
  }

  useEffect(() => { refresh(); }, []);

  async function createCourse() {
    const { data: me } = await supabase.auth.getUser();
    if (!me.user) return alert("Please login");
    if (!title.trim()) return;
    const { error } = await supabase.from("courses").insert({
      title, description: "", specialization: null, level: "Beginner", mode: "Self-paced",
      duration_weeks: null, fee: null, language: "English", eligibility: null, status: "draft",
      faculty_id: me.user.id
    });
    if (error) return alert(error.message);
    setTitle("");
    refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl text-slate-900">Faculty Panel</h1>
      <p className="text-slate-600 mt-1">Create and manage your courses, see enrollments.</p>

      {/* Create */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="New course title"
               className="md:col-span-3 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/15" />
        <button onClick={createCourse} className="rounded-lg bg-[#1d4ed8] text-white px-4 py-2 font-medium">Create</button>
      </div>

      {/* My Courses */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">My Courses</h2>
        {courses.length === 0 ? <p className="mt-3 text-slate-600">No courses yet.</p> : (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-medium text-slate-900">{c.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{c.specialization ?? "—"} • {c.level ?? "—"} • {c.mode ?? "—"}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-slate-500">{c.status}</span>
                  <a className="text-[#1d4ed8]" href={`/courses/${c.id}`}>View →</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Enrollments */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Recent Enrollments</h2>
        {enrolls.length === 0 ? <p className="mt-3 text-slate-600">No enrollments yet.</p> : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">When</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Student</th>
                </tr>
              </thead>
              <tbody>
                {enrolls.map(e => (
                  <tr key={e.enrollment_id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{new Date(e.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">{e.title}</td>
                    <td className="px-4 py-3">{e.student_name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
