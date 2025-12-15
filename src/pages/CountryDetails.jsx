import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BASE = "https://restcountries.com/v3.1";

function formatNumber(n) {
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
}

export default function CountryDetails() {
  const { code } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE}/alpha/${code}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        setItem(Array.isArray(json) ? json[0] : json);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load country");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="text-sm text-sky-700 hover:underline">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600">Loading…</p>
          </div>
        )}

        {error && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-700/80 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && item && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-64 bg-slate-100">
              {item.flags?.png && (
                <img
                  src={item.flags.png}
                  alt={item.flags?.alt || item.name?.common}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {item.name?.common}
                  </h1>
                  <p className="text-slate-600 mt-1">
                    {item.region} {item.subregion ? `— ${item.subregion}` : ""}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {item.cca3}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">Capital</p>
                  <p className="text-lg font-semibold">{item.capital?.[0] || "—"}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">Population</p>
                  <p className="text-lg font-semibold">{formatNumber(item.population || 0)}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">Region</p>
                  <p className="text-lg font-semibold">{item.region || "—"}</p>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Languages</p>
                    <p className="mt-1 font-medium text-slate-800">
                        {item.languages ? Object.values(item.languages).join(", ") : "—"}
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Currencies</p>
                    <p className="mt-1 font-medium text-slate-800">
                        {item.currencies
                            ? Object.values(item.currencies).map((c) => c.name).join(", ")
                            : "—"
                        }
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Borders</p>
                    <p className="mt-1 font-medium text-slate-800">
                        {Array.isArray(item.borders) && item.borders.length ? item.borders.join(", ") : "—"}
                    </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
