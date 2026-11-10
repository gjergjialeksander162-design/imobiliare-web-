import type { Deal } from "@/lib/types";

const currency = new Intl.NumberFormat("sq-AL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("sq-AL", { maximumFractionDigits: 0 });

/** Kursi EUR → Lek (ALL); ndryshohet me NEXT_PUBLIC_EUR_ALL_RATE në Vercel. */
export const EUR_ALL_RATE = Number(process.env.NEXT_PUBLIC_EUR_ALL_RATE) || 98;

export function toLek(priceEur: number): number {
  return Math.round((priceEur * EUR_ALL_RATE) / 1000) * 1000;
}

/** Çmimi në Lek, i rrumbullakosur në mijëra: "8 430 000 L" (+ "/muaj" për qira). */
export function formatLek(priceEur: number, deal: Deal): string {
  const value = `${number.format(toLek(priceEur))} L`;
  return deal === "qira" ? `${value}/muaj` : value;
}

export function formatPrice(price: number, deal: Deal): string {
  const value = currency.format(price);
  return deal === "qira" ? `${value}/muaj` : value;
}

export function formatNumber(value: number): string {
  return number.format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
