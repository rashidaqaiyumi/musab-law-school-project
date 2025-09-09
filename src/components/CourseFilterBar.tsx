import { Dispatch, SetStateAction } from "react";

export type CourseFilters = {
  q: string;
  degree: string;         // degree_type
  specialization: string; // specialization
};

export default function CourseFilterBar({
  filters, setFilters, onClear
}: {
  filters: CourseFilters;
  setFilters: Dispatch<SetStateAction<CourseFilters>>;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-gray-700">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">⚙️</span>
        <span className="font-medium">Filter Courses</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">🔎</span>
          <input
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder="Search courses…"
            className="w-full rounded-xl border px-10 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <select
          value={filters.degree}
          onChange={(e) => setFilters((f) => ({ ...f, degree: e.target.value }))}
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Types</option>
          <option value="Certificate">Certificate</option>
          <option value="Diploma">Diploma</option>
          <option value="LLB">LLB</option>
          <option value="LLM">LLM</option>
        </select>

        <select
          value={filters.specialization}
          onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))}
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Specializations</option>
          <option value="Constitutional Law">Constitutional Law</option>
          <option value="Corporate Law">Corporate Law</option>
          <option value="Criminal Law">Criminal Law</option>
          <option value="Human Rights">Human Rights</option>
        </select>

        <button onClick={onClear}
          className="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50">
          Clear Filters
        </button>
      </div>
    </div>
  );
}
