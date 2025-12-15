export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-slate-300">
        Page {page} / {totalPages}
      </div>

      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
