import { z } from "zod";

// CREATE RECORD
export const createRecordSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),

  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be income or expense" }),
  }),

  category: z
    .string()
    .min(1, "Category is required")
    .trim(),

  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  note: z
    .string()
    .max(200, "Note too long")
    .optional(),
});

// UPDATE RECORD (all optional)
export const updateRecordSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .optional(),

  type: z.enum(["income", "expense"]).optional(),

  category: z.string().min(1).trim().optional(),

  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  note: z
    .string()
    .max(200, "Note too long")
    .optional(),
});