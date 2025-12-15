import { Link } from "react-router-dom";

function formatNumber(n) {
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
}

export default function CountriesTable({ items }) {
  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Capital</th>
              <th className="px-4 py-3 font-medium text-right">Population</th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => {
              const name = c.name?.common || "Unknown";
              const capital = c.capital?.[0] || "—";
              const region = c.region || "—";

              return (
                <tr key={c.cca3} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/country/${c.cca3}`}
                      className="flex items-center gap-3 font-medium text-slate-900 hover:text-sky-700"
                    >
                      <span className="w-7 h-5 rounded overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        {c.flags?.png ? (
                          <img src={c.flags.png} alt={name} className="w-full h-full object-cover" />
                        ) : null}
                      </span>
                      <span className="truncate">{name}</span>
                      <span className="text-xs text-slate-400 font-normal">({c.cca3})</span>
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-slate-700">{region}</td>
                  <td className="px-4 py-3 text-slate-700">{capital}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatNumber(c.population || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-slate-600">No results.</div>
        )}
      </div>
    </div>
  );
}
