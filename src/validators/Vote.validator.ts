import { z } from "zod";

// -------------------------------
// Validator for casting a vote
// -------------------------------
export const castVoteValidator = z.object({
  candidate_id: z.string().uuid({ message: "Invalid candidate ID" }),
  position_id: z.string().uuid({ message: "Invalid position ID" }),
  election_id: z.string().uuid({ message: "Invalid election ID" }),
});

// -------------------------------
// Validator for query params / route params
// -------------------------------
export const getVotesByCandidateValidator = z.object({
  candidate_id: z.string().uuid({ message: "Invalid candidate ID" }),
});

export const getVotesByElectionValidator = z.object({
  election_id: z.string().uuid({ message: "Invalid election ID" }),
});

// -------------------------------
// Validator for public aggregated vote counts
// -------------------------------
export const getVoteCountsByElectionValidator = z.object({
  election_id: z.string().uuid({ message: "Invalid election ID" }),
});
