export default function SkeletonCourseCard() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 h-24 rounded-xl bg-gray-100" />
      <div className="h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
      <div className="mt-6 flex items-center justify-between">
        <div className="h-6 w-16 rounded bg-gray-100" />
        <div className="h-9 w-28 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
