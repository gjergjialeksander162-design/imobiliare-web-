import type { Deal } from "@/lib/types";

const currency = new Intl.NumberFormat("sq-AL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("sq-AL", { maximumFractionDigits: 0 });

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
