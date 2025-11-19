// src/validators/elections.validator.ts
import { z } from "zod";

// -------------------------------
// Create / Update Election Validator
// -------------------------------
export const electionValidator = z.object({
  name: z.string().min(3, "Election name must be at least 3 characters"),
  start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "start_date must be a valid date string",
  }),
  end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "end_date must be a valid date string",
  }),
  created_by: z.string().uuid("created_by must be a valid UUID"),
  status: z
    .enum(["upcoming", "ongoing", "finished"])
    .optional(), // Optional for creation; default is 'upcoming'
});

// -------------------------------
// Change Election Status Validator
// -------------------------------
export const changeElectionStatusValidator = z.object({
  status: z.enum(["upcoming", "ongoing", "finished"]),
});

// -------------------------------
// Get Elections by Status Validator
// -------------------------------
export const getElectionsByStatusValidator = z.object({
  status: z.enum(["upcoming", "ongoing", "finished"]),
});
