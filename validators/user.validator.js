import { z } from "zod";

// ✅ Roles enum (reuse everywhere)
export const rolesEnum = z.enum(["ADMIN", "ANALYST", "VIEWER"]);

// ==============================
// 🔹 REGISTER USER
// ==============================
export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: rolesEnum.optional(), // default can be VIEWER in backend

  status: z
    .boolean()
    .optional(), // true = active, false = inactive
});

// ==============================
// 🔹 UPDATE USER
// ==============================
export const updateUserSchema = z.object({
  name: z.string().min(2).trim().optional(),

  email: z.string().email().toLowerCase().optional(),

  password: z.string().min(6).optional(),
});

// ==============================
// 🔹 CHANGE ROLE (Admin only)
// ==============================
export const changeRoleSchema = z.object({
  role: rolesEnum,
});

// ==============================
// 🔹 CHANGE STATUS (Admin only)
// ==============================
export const changeStatusSchema = z.object({
  status: z.boolean(),
});