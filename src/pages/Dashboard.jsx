import { useEffect, useMemo, useState } from "react";
import { fetchAllCountries } from "../api/countries";
import Controls from "../components/Controls";
import CountryCard from "../components/CountryCard";
import Pagination from "../components/Pagination";
import CountriesTable from "../components/CountriesTable";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

export default function Dashboard() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("name_asc");

  const [page, setPage] = useState(1);
  const [perPage] = useState(12);

  const [view, setView] = useState("cards"); // "cards" | "table"


  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllCountries();
        if (cancelled) return;
        setAll(data);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load countries");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset pagination when filters change (UX detail)
  useEffect(() => {
    setPage(1);
  }, [q, region, sort]);

  const filtered = useMemo(() => {
    const query = normalize(q);
    let list = all;

    if (region !== "all") {
      list = list.filter((c) => c.region === region);
    }

    if (query) {
      list = list.filter((c) => normalize(c.name?.common).includes(query));
    }

    const copy = [...list];
    if (sort === "name_asc") copy.sort((a, b) => (a.name?.common || "").localeCompare(b.name?.common || ""));
    if (sort === "name_desc") copy.sort((a, b) => (b.name?.common || "").localeCompare(a.name?.common || ""));
    if (sort === "pop_desc") copy.sort((a, b) => (b.population || 0) - (a.population || 0));
    if (sort === "pop_asc") copy.sort((a, b) => (a.population || 0) - (b.population || 0));

    return copy;
  }, [all, q, region, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const stats = useMemo(() => {
    const results = filtered.length;

    const regionsSet = new Set(filtered.map(c => c.region).filter(Boolean));
    const regionsCount = regionsSet.size;

    const totalPop = filtered.reduce((sum, c) => sum + (c.population || 0), 0);
    const avgPop = results ? Math.round(totalPop / results) : 0;

    return { results, regionsCount, avgPop };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">🌍 Countries Dashboard</h1>
                <p className="text-sm text-slate-600">
                    Explore, filter and compare countries data (REST Countries).
                </p>
            </div>

            <div className="hidden sm:flex items-center gap-3">
                {/* KPI: Results */}
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
                    <p className="text-xs text-slate-500">Results</p>
                    <p className="text-lg font-semibold">{stats.results}</p>
                </div>

                {/* KPI: Regions */}
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
                    <p className="text-xs text-slate-500">Regions</p>
                    <p className="text-lg font-semibold">{stats.regionsCount}</p>
                </div>

                {/* KPI: Avg population */}
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
                    <p className="text-xs text-slate-500">Avg population</p>
                    <p className="text-lg font-semibold">{new Intl.NumberFormat().format(stats.avgPop)}</p>
                </div>

                {/* Pagination (compact) */}
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm flex items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="text-sm px-2 py-1 rounded disabled:opacity-40 hover:bg-slate-100"
                    >
                        ← Prev
                    </button>

                    <span className="text-sm font-medium text-slate-700">
                        {page} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="text-sm px-2 py-1 rounded disabled:opacity-40 hover:bg-slate-100"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Controls
          q={q}
          setQ={setQ}
          region={region}
          setRegion={setRegion}
          sort={sort}
          setSort={setSort}
        />

        <div className="mt-4 flex items-center justify-end">
            <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex gap-1">
                <button
                    onClick={() => setView("cards")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        view === "cards" ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    Cards
                </button>
                <button
                    onClick={() => setView("table")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        view === "table" ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    Table
                </button>
            </div>
        </div>        

        {loading && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600">Loading countries…</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-700/80 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && view === "cards" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((c) => (
                <CountryCard key={c.cca3} c={c} />
            ))}
            </div>
        ) : (
            <CountriesTable items={pageItems} />
        )}
      </main>
    </div>
  );
}
