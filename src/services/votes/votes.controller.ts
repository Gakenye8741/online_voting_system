import { RequestHandler } from "express";
import {
  castVoteService,
  getVotesByCandidateService,
  getVotesByElectionService,
  getVoteCountsByElectionService,
} from "./votes.service";
import { VoteInsert } from "../../drizzle/schema";
import {
  castVoteValidator,
  getVotesByCandidateValidator,
  getVotesByElectionValidator,
  getVoteCountsByElectionValidator,
} from "../../validators/Vote.validator";

// -------------------------------
// Cast a vote
// -------------------------------
export const castVote: RequestHandler = async (req, res) => {
  const parseResult = castVoteValidator.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { candidate_id, position_id, election_id } = parseResult.data;
    const voteData: VoteInsert = {
      candidate_id,
      position_id,
      election_id,
      voter_id: (req as any).user.id,
    };

    const vote = await castVoteService(voteData);
    res.status(201).json({ message: "Vote cast successfully", vote });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------------------
// Get all votes for a candidate (admin only)
// -------------------------------
export const getVotesByCandidate: RequestHandler = async (req, res) => {
  const parseResult = getVotesByCandidateValidator.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { candidate_id } = parseResult.data;
    const votes = await getVotesByCandidateService(candidate_id);
    res.status(200).json({ votes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------
// Get all votes for an election (admin only)
// -------------------------------
export const getVotesByElection: RequestHandler = async (req, res) => {
  const parseResult = getVotesByElectionValidator.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { election_id } = parseResult.data;
    const votes = await getVotesByElectionService(election_id);
    res.status(200).json({ votes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------
// Get aggregated vote counts for an election (public)
// -------------------------------
export const getVoteCountsByElection: RequestHandler = async (req, res) => {
  const parseResult = getVoteCountsByElectionValidator.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { election_id } = parseResult.data;
    const counts = await getVoteCountsByElectionService(election_id);
    res.status(200).json({ counts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
