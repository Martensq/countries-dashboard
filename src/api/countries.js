const BASE = "https://restcountries.com/v3.1";

// champs limités = plus rapide (et plus propre)
const FIELDS = [
  "name",
  "cca3",
  "flags",
  "region",
  "subregion",
  "population",
  "capital",
].join(",");

export async function fetchAllCountries() {
  const res = await fetch(`${BASE}/all?fields=${FIELDS}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [];
}
