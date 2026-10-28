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
