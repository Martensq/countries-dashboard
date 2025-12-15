import { Link } from "react-router-dom";

function formatNumber(n) {
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
}

export default function CountryCard({ c }) {
  const name = c.name?.common || "Unknown";
  const capital = c.capital?.[0] || "—";
  const region = c.region || "—";
  const subregion = c.subregion || "—";
  const population = formatNumber(c.population || 0);

  return (
    <Link
      to={`/country/${c.cca3}`}
      className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-sky-200 transition"
    >
      <div className="h-36 bg-slate-100 overflow-hidden">
        {c.flags?.png ? (
          <img
            src={c.flags.png}
            alt={c.flags?.alt || name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            No flag
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg leading-tight">{name}</h3>
          <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
            {region}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
            <p className="text-xs text-slate-500">Capital</p>
            <p className="font-medium truncate">{capital}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
            <p className="text-xs text-slate-500">Subregion</p>
            <p className="font-medium truncate">{subregion}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
            <p className="text-xs text-slate-500">Population</p>
            <p className="font-medium truncate">{population}</p>
          </div>
        </div>

        <div className="mt-4 text-sm text-sky-700 font-medium">
          View details →
        </div>
      </div>
    </Link>
  );
}
