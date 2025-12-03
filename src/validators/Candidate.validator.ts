import { z } from "zod";

// ---- Enums (based on your Drizzle schema) ----
export const schoolEnum = z.enum([
  "Science",
  "Education",
  "Business",
  "Humanities and Developmental_Studies",
  "TVET",
]);

// ---- Candidate Validator ----
export const candidateValidator = z.object({
  position_id: z
    .string()
    .uuid("position_id must be a valid UUID"),

  name: z
    .string()
    .min(3, "Candidate name must be at least 3 characters")
    .max(255),

  photo_url: z
    .string()
    .url("photo_url must be a valid URL")
    .optional()
    .nullable(),

  bio: z
    .string()
    .optional()
    .nullable(),

  coalition_id: z
    .string()
    .uuid("coalition_id must be a valid UUID")
    .optional()
    .nullable(),

  school: schoolEnum,
});

// ---- Validator for candidate ID ----
export const candidateIdValidator = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});
