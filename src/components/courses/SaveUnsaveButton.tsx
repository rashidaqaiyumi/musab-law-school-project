import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SaveUnsaveButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("saved_courses")
        .select("user_id, course_id")
        .eq("user_id", uid)
        .eq("course_id", courseId)
        .maybeSingle();

      if (!cancelled) {
        setSaved(Boolean(data) && !error);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [courseId]);

  async function toggle() {
    if (!userId) {
      // not logged in – send to login
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }
    setLoading(true);
    if (saved) {
      const { error } = await supabase
        .from("saved_courses")
        .delete()
        .eq("user_id", userId)
        .eq("course_id", courseId);
      if (!error) setSaved(false);
    } else {
      const { error } = await supabase.from("saved_courses").insert({ user_id: userId, course_id: courseId });
      if (!error) setSaved(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition
        ${saved ? "bg-[#eaf0ff] text-[#1d4ed8] hover:bg-[#dfe8ff]" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
      title={saved ? "Unsave" : "Save"}
    >
      {loading ? "…" : saved ? "Saved" : "Save"}
    </button>
  );
}
