import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Profile = { id: string; full_name: string | null; role: "student" | "faculty" | "admin" };

function roleToPath(role: Profile["role"]) {
  switch (role) {
    case "admin": return "/admin/dashboard";
    case "faculty": return "/faculty/dashboard";
    default: return "/student/dashboard";
  }
}

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: u1 }, { data: u2 }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.auth.getSession()
      ]);
      const user = u1.user ?? u2.session?.user ?? null;
      setEmail(user?.email ?? null);
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .single();
      setProfile(data as Profile | null);
    })();
  }, []);

  const initial = (profile?.full_name || email || "?").trim().charAt(0).toUpperCase();
  const role = profile?.role ?? "student";
  const dash = roleToPath(role);

  async function onSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
          {role}
        </span>
        <span className="w-8 h-8 rounded-full bg-slate-800 text-white grid place-items-center">{initial}</span>
      </button>

      {/* dropdown */}
      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50"
          role="menu"
        >
          <div className="px-3 py-2 text-xs text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{email ?? "—"}</span>
          </div>
          <div className="border-t border-slate-200" />
          <MenuLink to={dash} label="Dashboard" />
          <MenuLink to="/student/dashboard#enrollments" label="My Enrollments" />
          <MenuLink to="/student/dashboard#saved" label="Saved Courses" />
          <MenuLink to="/student/dashboard#profile" label="Profile" />
          <div className="border-t border-slate-200" />
          <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="block px-4 py-2 text-sm hover:bg-slate-50" role="menuitem">
      {label}
    </Link>
  );
}
