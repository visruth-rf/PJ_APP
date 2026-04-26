import { z } from "zod";

/**
 * Converts paise (integer storage value) to rupees decimal for UI only.
 */
export function toRupees(paise: number): number {
  if (!Number.isInteger(paise)) {
    throw new Error("Money must be stored as integer paise.");
  }

  return paise / 100;
}

/**
 * Converts a rupee input to paise integer.
 * Uses Math.round to safely handle decimal-string parsing artifacts.
 */
export function toPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) {
    throw new Error("Invalid rupee amount.");
  }

  return Math.round(rupees * 100);
}

/**
 * Formats paise using Indian numbering format with rupee symbol.
 */
export function formatINR(paise: number): string {
  if (!Number.isInteger(paise)) {
    throw new Error("Money must be stored as integer paise.");
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(toRupees(paise));
}

const amountStringRegex = /^\d+(\.\d{1,2})?$/;

export const rupeeAmountStringSchema = z
  .string()
  .trim()
  .min(1, "Amount is required")
  .refine((value) => amountStringRegex.test(value), "Enter a valid amount (up to 2 decimals)");

export const paiseAmountSchema = z.number().int().nonnegative("Amount must be 0 or more");

export const positivePaiseAmountSchema = z.number().int().positive("Amount must be greater than 0");
