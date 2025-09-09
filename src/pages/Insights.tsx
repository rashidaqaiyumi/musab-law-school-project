import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Insights() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("insights")
        .select("id,title,slug,content,published_at,status")
        .eq("status","published")
        .order("published_at",{ascending:false});
      setPosts(data ?? []);
    })();
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {posts.map(p => (
        <article key={p.id} className="border rounded p-4">
          <h3 className="font-semibold text-lg">{p.title}</h3>
          <p className="mt-2 text-sm opacity-80">{p.content}</p>
          <div className="text-xs opacity-60 mt-2">
            {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
          </div>
        </article>
      ))}
    </div>
  );
}

