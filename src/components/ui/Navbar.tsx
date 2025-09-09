import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";  // Correct path
import AccountMenu from "../AccountMenu";

type SessionUser = {
  id: string;
  email: string | null;
  role: string;  // Add role to session user type
};

export default function Navbar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const location = useLocation();

  // watch auth state
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const u = data.session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? null, role: u.role ?? "student" });  // Get role
      } else {
        setUser(null);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? null, role: u.role ?? "student" });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // active link styles
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm ${isActive ? "text-[#1d4ed8] font-medium" : "text-slate-700 hover:text-slate-900"}`;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1d4ed8] text-white grid place-items-center font-bold">⚖️</div>
            <div>
              <div className="font-semibold text-slate-900 leading-tight">Musab Law School</div>
              <div className="text-[11px] text-slate-500 -mt-0.5">Professional Legal Education</div>
            </div>
          </Link>

          {/* Primary links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkCls}>Home</NavLink>
            <NavLink to="/courses" className={linkCls}>Courses</NavLink>
            <NavLink to="/faculty" className={linkCls}>Faculty</NavLink>
            <NavLink to="/insights" className={linkCls}>Legal Insights</NavLink>
            <NavLink to="/testimonials" className={linkCls}>Testimonials</NavLink>
            <NavLink to="/faq" className={linkCls}>FAQ</NavLink>
            <NavLink to="/contact" className={linkCls}>Contact</NavLink>
          </div>

          {/* Right side: auth area */}
          <div className="flex items-center gap-3">
            {/* If logged in -> account menu, else -> login / sign up */}
            {user ? (
              <AccountMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="hidden md:inline-block text-sm px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  state={{ from: location.pathname }}
                  className="text-sm px-3 py-2 rounded-lg bg-[#1d4ed8] text-white hover:opacity-95 shadow"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
