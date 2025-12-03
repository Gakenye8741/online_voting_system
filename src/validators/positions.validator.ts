import { z } from "zod";

// Enums based on your Drizzle schema
export const schoolEnum = z.enum([
  "Science",
  "Education",
  "Business",
  "Humanities and Developmental_Studies",
  "TVET",
]);

export const positionTierEnum = z.enum([
  "school",
  "college",
  "department",
]);

// Create / Update Position Validator
export const positionValidator = z.object({
  election_id: z.string().uuid("election_id must be a valid UUID"),

  name: z
    .string()
    .min(3, "Position name must be at least 3 characters")
    .max(100),
  description: z.string().optional(),

  // Matches your positionTier enum
  tier: positionTierEnum,

  // coalition_id allowed only when tier !== "school"
  coalition_id: z
    .string()
    .uuid("coalition_id must be a valid UUID")
    .optional()
    .nullable(),
})
.refine(
  (data) => {
    // If the tier is "school", coalition_id must NOT exist
    if (data.tier === "school") return !data.coalition_id;
    return true;
  },
  {
    message: "School-level positions cannot belong to a coalition",
    path: ["coalition_id"],
  }
);

// Validator for position ID
export const positionIdValidator = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});
