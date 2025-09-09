import { Link } from "react-router-dom";

export default function CourseCatalogCard({
  id, title, description, specialization, duration, fee, faculty_name
}: {
  id: string;
  title: string;
  description: string | null;
  specialization: string | null;
  duration: number | null;
  fee: number | null;
  faculty_name?: string | null;
}) {
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md">
      {/* Minimal hero placeholder since we omitted thumbnails */}
      <div className="mb-4 grid h-24 place-items-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
        ⚖️
      </div>

      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 line-clamp-3">{description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {specialization ? <span className="rounded-full bg-gray-100 px-2 py-1">{specialization}</span> : null}
        {duration ? <span>• {duration} weeks</span> : null}
        {faculty_name ? <span>• {faculty_name}</span> : null}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-[#1d4ed8]">{fee ? `₹${fee}` : "Free"}</div>
        <Link to={`/courses/${id}`} className="rounded-xl bg-[#1d4ed8] px-4 py-2 text-white hover:opacity-90">
          View details
        </Link>
      </div>
    </article>
  );
}
