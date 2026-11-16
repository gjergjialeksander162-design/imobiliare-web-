/** Normalizon tekstin për krahasim: pa diakritika (ë→e, ç→c), pa hapësira të tepërta, shkronja të vogla. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Çdo fjalë e kërkimit duhet të gjendet (pa diakritika) në tekstin e pronës. */
export function matchesQuery(haystack: string, query: string): boolean {
  const words = normalizeText(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const text = normalizeText(haystack);
  return words.every((word) => text.includes(word));
}

const KNOWN_CITIES = [
  "Tiranë", "Durrës", "Vlorë", "Shkodër", "Elbasan", "Korçë", "Fier", "Berat",
  "Sarandë", "Lezhë", "Kukës", "Pogradec", "Kavajë", "Gjirokastër", "Himarë",
  "Kamëz", "Vorë", "Golem", "Shëngjin", "Ksamil", "Dhërmi", "Lushnjë", "Përmet",
  "Krujë", "Tepelenë", "Peshkopi", "Burrel", "Librazhd", "Gramsh", "Divjakë",
  "Velipojë", "Orikum", "Laç", "Rrogozhinë", "Peqin", "Patos", "Ballsh",
  "Bulqizë", "Ersekë", "Delvinë", "Konispol", "Pukë", "Bajram Curri",
];

const CITY_BY_KEY = new Map(KNOWN_CITIES.map((city) => [normalizeText(city), city]));

/** Shkrimi kanonik i qytetit: "TIRANE", "tirana " dhe "Tiranë" bëhen "Tiranë". */
export function canonicalCity(value: string): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  const key = normalizeText(cleaned);
  const known = CITY_BY_KEY.get(key) ?? CITY_BY_KEY.get(key.replace(/a$/, "e"));
  if (known) return known;
  if (cleaned !== cleaned.toUpperCase() && cleaned !== cleaned.toLowerCase()) return cleaned;
  return cleaned
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toUpperCase());
}

/** Lista e qyteteve pa dublikata shkrimi, e renditur. */
export function uniqueCities(values: string[]): string[] {
  return [...new Set(values.map(canonicalCity).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "sq"),
  );
}
