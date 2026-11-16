import type { Currency, Deal } from "@/lib/types";

const currency = new Intl.NumberFormat("sq-AL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("sq-AL", { maximumFractionDigits: 0 });

/**
 * Kursi EUR → Lek. Përdoret vetëm për të krahasuar çmime me monedha të ndryshme
 * (filtra, renditje, përputhje në CRM); në faqe nuk shfaqet asnjë çmim i konvertuar.
 */
export const EUR_ALL_RATE = Number(process.env.NEXT_PUBLIC_EUR_ALL_RATE) || 98;

export function priceInEur(property: { price: number; currency: Currency }): number {
  return property.currency === "ALL" ? property.price / EUR_ALL_RATE : property.price;
}

/** Çmimi në monedhën e pronës: "86 000 €" ose "8 500 000 L" (+ "/muaj" për qira). */
export function formatPrice(price: number, deal: Deal, priceCurrency: Currency = "EUR"): string {
  const value =
    priceCurrency === "ALL" ? `${number.format(price)} L` : currency.format(price);
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
