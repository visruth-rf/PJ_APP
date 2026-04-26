import { z } from "zod";

export const customerNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(120, "Name must be 120 characters or less")
  .refine((value) => /[A-Za-z]/.test(value), "Name must contain at least one alphabetic letter");

export const customerPhoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, "Phone number must be 10 digits");

export const createCustomerSchema = z.object({
  name: customerNameSchema,
  phone: customerPhoneSchema
});

export const searchCustomersSchema = z.object({
  search: z.string().trim().max(50).optional()
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
