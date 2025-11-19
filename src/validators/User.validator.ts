import z from "zod";

export const userValidator = z.object({
  reg_no: z.string().min(3, "Registration number must be at least 3 characters"),
  role: z.enum(["voter", "admin"]).default("voter"),

  // Optional fields
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  school: z.enum([
    "Science",
    "Education",
    "Business",
    "Humanities and Developmental_Studies",
    "TVET",
  ]).optional(),
  expected_graduation: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Graduation must be in MM/YYYY format")
    .optional(),
  graduation_status: z
    .enum(["active", "graduated", "deferred", "inactive"])
    .default("active"),

  // Security fields
  secret_code_hash: z.string().optional(),
  has_secret_code: z.boolean().default(false),
  face_embedding: z.string().optional(),
  has_face_verification: z.boolean().default(false),

  // Password field
  password: z.string().min(6, "Password must be at least 6 characters"),
});