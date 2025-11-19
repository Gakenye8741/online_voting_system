import { Router } from "express";
import {
  castVote,
  getVotesByCandidate,
  getVotesByElection,
  getVoteCountsByElection,
} from "./votes.controller";
import { anyAuthenticatedUser, adminAuth } from "../../middlewares/bearAuth";

const VotesRouter = Router();

// -------------------------------
// Cast a vote (any authenticated user)
VotesRouter.post("/", anyAuthenticatedUser, castVote);

// -------------------------------
// Get votes for a specific candidate (admin only)
VotesRouter.get("/candidate/:candidate_id", adminAuth, getVotesByCandidate);

// -------------------------------
// Get votes for a specific election (admin only)
VotesRouter.get("/election/:election_id", adminAuth, getVotesByElection);

// -------------------------------
// Get aggregated vote counts for a specific election (public)
VotesRouter.get("/counts/:election_id", anyAuthenticatedUser, getVoteCountsByElection);

export default VotesRouter;
