import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, courses: 0, enrollments: 0, orders: 0 });

  useEffect(() => {
    (async () => {
      const users = (await supabase.from("profiles").select("id", { count: "exact", head: true })).count ?? 0;
      const courses = (await supabase.from("courses").select("id", { count: "exact", head: true })).count ?? 0;
      const enrollments = (await supabase.from("enrollments").select("id", { count: "exact", head: true })).count ?? 0;
      const orders = (await supabase.from("orders").select("id", { count: "exact", head: true })).count ?? 0;
      setCounts({ users, courses, enrollments, orders });
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl text-slate-900">Admin Panel</h1>
      <p className="text-slate-600 mt-1">Global oversight & quick stats.</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Users" value={counts.users} />
        <StatCard label="Courses" value={counts.courses} />
        <StatCard label="Enrollments" value={counts.enrollments} />
        <StatCard label="Orders" value={counts.orders} />
      </div>

      <p className="mt-10 text-slate-600">Next: moderation tables (courses/insights/testimonials) & payments audit.</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-3xl font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}
