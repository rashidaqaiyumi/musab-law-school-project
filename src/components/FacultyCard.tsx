import { Link } from "react-router-dom";

export default function FacultyCard({
  id, full_name, bio, avatar_url, specialization
}: {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url?: string | null;
  specialization?: string | null;
}) {
  const initials = (full_name ?? "?")
    .split(" ")
    .map(s => s[0])
    .slice(0,2)
    .join("")
    .toUpperCase();

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 text-lg text-gray-500 overflow-hidden">
          {avatar_url ? (
            <img src={avatar_url} alt={full_name ?? "Faculty"} className="h-full w-full object-cover" />
          ) : initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{full_name}</h3>
          <p className="text-sm text-gray-500">{specialization ?? "Faculty"}</p>
        </div>
      </div>

      {bio && <p className="mt-4 line-clamp-3 text-sm text-gray-700">{bio}</p>}

      <div className="mt-5 flex items-center justify-between">
        <Link
          to={`/courses?faculty=${encodeURIComponent(id)}`}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
        >
          View courses
        </Link>
        <Link
          to={`/contact?to=${encodeURIComponent(full_name ?? "")}`}
          className="rounded-xl bg-[#1d4ed8] px-3 py-2 text-sm text-white hover:opacity-90"
        >
          Contact
        </Link>
      </div>
    </article>
  );
}
