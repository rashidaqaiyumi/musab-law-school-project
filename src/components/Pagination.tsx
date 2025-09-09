export default function Pagination({
  page, totalPages, onPrev, onNext
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-lg border px-3 py-1 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">
        Page <span className="font-medium text-gray-900">{page}</span> / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-lg border px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
