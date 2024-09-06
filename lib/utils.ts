import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const locales: Record<string, string> = {
  USD: "en-US",
  COP: "es-CO",
  EUR: "es-ES", 
};

export function createFormatter(currency: string = "COP") {
  const locale = locales[currency] || "es-CO";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}

export const formatter = createFormatter("COP");
