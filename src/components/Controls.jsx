export default function Controls({ q, setQ, region, setRegion, sort, setSort }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <input
        className="w-full md:w-1/2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
        placeholder="Search a country…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="flex gap-3 flex-wrap">
        <select
          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="all">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select
          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="name_asc">Name (A→Z)</option>
          <option value="name_desc">Name (Z→A)</option>
          <option value="pop_desc">Population (high→low)</option>
          <option value="pop_asc">Population (low→high)</option>
        </select>
      </div>
    </div>
  );
}
