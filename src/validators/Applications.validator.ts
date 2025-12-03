import { z } from "zod";

/* ===============================
   1️⃣ Define School Enum (TS version)
=============================== */
export enum SchoolEnum {
  Science = "Science",
  Education = "Education",
  Business = "Business",
  Humanities_and_Developmental_Studies = "Humanities and Developmental_Studies",
  TVET = "TVET",
}

/* ===============================
   2️⃣ Zod Schema for Candidate Application
=============================== */
export const candidateApplicationSchema = z.object({
  student_id: z.string().uuid({
    message: "Invalid student ID format",
  }),
  position_id: z.string().uuid({
    message: "Invalid position ID format",
  }),
  manifesto: z.string().min(10, {
    message: "Manifesto must be at least 10 characters",
  }),
  documents_url: z
    .array(z.string().url({ message: "Each document must be a valid URL" }))
    .min(1, { message: "At least one document is required" }),
  school: z.nativeEnum(SchoolEnum, {
    errorMap: () => ({ message: "Invalid school selected" }),
  }),
});

/* ===============================
   3️⃣ Validator Function
=============================== */
export function validateCandidateApplication(data: any) {
  try {
    const validatedData = candidateApplicationSchema.parse(data);
    return { valid: true, data: validatedData };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return { valid: false, errors };
    }
    throw err;
  }
}
