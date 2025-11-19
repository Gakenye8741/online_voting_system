import { z } from "zod";

/* ================================
   User Registration Validator
   Minimal fields: reg_no + password
   Password defaults to reg_no if not provided
================================ */
export const allowedRoles = [
  "voter",
  "admin",
  "Dean_of_Science",
  "Dean_of_Education",
  "Dean_of_Business",
  "Dean_of_Humanities_and_Developmental_Studies",
  "Dean_of_TVET",
  "Dean_of_Students",
] as const;

export const registerUserValidator = z.object({
  reg_no: z
    .string()
    .min(3, "Registration number must be at least 3 characters")
    .trim()
    .regex(
      /^[a-zA-Z0-9\/]+$/,
      "Registration number can only contain letters, numbers, and slashes"
    ),
  password: z.string().min(3, "Password must be at least 3 characters").trim(),
  role: z
    .enum(allowedRoles)
    .optional()
    .default("voter"), // if not provided, defaults to "voter"
});

/* ================================
   User Login Validator
   Login via reg_no + password
================================ */
export const loginUserValidator = z.object({
  reg_no: z
    .string()
    .min(3, "Registration number must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

/* ================================
   First-time Profile Completion Validator
   Students update name, school, and expected graduation
================================ */
export const completeProfileValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  school: z.enum([
    "Science",
    "Education",
    "Business",
    "Humanities and Developmental_Studies",
    "TVET",
  ]),
//   graduationStatus: z.enum([
//     "active","graduated","deffered","inactive"
//   ]),
  expected_graduation: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Expected graduation must be in MM/YYYY format"),
    
});

/* ================================
   Password Update Validator
================================ */
export const updatePasswordValidator = z.object({
  password: z.string().min(3, "Password must be at least 3 characters"),
});
