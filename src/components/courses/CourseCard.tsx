import { Link } from 'react-router-dom';

type Course = {
  id: string;
  title: string;
  description: string | null;
  fee: number;
  price?: number | null;
  language?: string | null;
  specialization?: string | null;
};

interface CourseCardProps {
  c: Course;
  context: string;
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function CourseCard({ c }: CourseCardProps) {
  return (
    <Link to={`/courses/${c.id}`} className="block">
      <div className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-snug">{c.title}</h3>
          {c.specialization && (
            <span className="text-[11px] bg-gray-100 border rounded px-2 py-0.5 whitespace-nowrap">
              {c.specialization}
            </span>
          )}
        </div>
        <p className="text-sm mt-2 line-clamp-3 opacity-80">
          {c.description || 'No description available'}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="font-semibold">
            {c.fee > 0 ? inr.format(c.fee) : 'Free'}
          </div>
          {c.language && (
            <span className="text-xs text-gray-500">• {c.language}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
