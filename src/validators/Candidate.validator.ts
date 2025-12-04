import { z } from "zod";

// Example School enum (replace with your actual definition)
export const SchoolEnum = z.enum([
  "Science",
  "Education",
  "Business",
  "Humanities and Developmental_Studies",
  "TVET",
]);

export const createCandidateSchema = z.object({
  position_id: z.string().uuid({
    message: "Position ID must be a valid UUID",
  }),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be at most 255 characters" }),
  photo_url: z.string()
    .url({ message: "Photo must be a valid URL" })
    .max(255)
    .optional(),
  bio: z.string().optional(),
  coalition_id: z.string()
    .uuid({ message: "Coalition ID must be a valid UUID" })
    .optional(),
  school: SchoolEnum.optional(),
});

// Example usage for update, you may allow partial updates
export const updateCandidateSchema = createCandidateSchema.partial();
