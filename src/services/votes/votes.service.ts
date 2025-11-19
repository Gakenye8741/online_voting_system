import db from "../../drizzle/db";
import { and, eq, sql } from "drizzle-orm";
import { votes, VoteInsert, VoteSelect } from "../../drizzle/schema";
import { createBlockFromVote } from "../BlockChain/BlockChain.service";

// -------------------------------
// Cast a vote
// -------------------------------
export const castVoteService = async (voteData: VoteInsert): Promise<VoteSelect> => {
  // Prevent double voting per position
  const existingVote = await db.query.votes.findFirst({
    where: and(
      eq(votes.voter_id, voteData.voter_id),
      eq(votes.position_id, voteData.position_id)
    ),
  });
  if (existingVote) throw new Error("You have already voted for this position");

  const [newVote] = await db.insert(votes).values(voteData).returning();
  if (!newVote) throw new Error("Failed to cast vote");

  // Create blockchain block
  await createBlockFromVote(newVote);

  return newVote;
};

// -------------------------------
// Get all votes for a candidate (admin)
// -------------------------------
export const getVotesByCandidateService = async (candidate_id: string): Promise<VoteSelect[]> => {
  return db.query.votes.findMany({ where: eq(votes.candidate_id, candidate_id) });
};

// -------------------------------
// Get all votes for an election (admin)
// -------------------------------
export const getVotesByElectionService = async (election_id: string): Promise<VoteSelect[]> => {
  return db.query.votes.findMany({ where: eq(votes.election_id, election_id) });
};

// -------------------------------
// Get aggregated vote counts for an election (public)
// -------------------------------
export const getVoteCountsByElectionService = async (election_id: string) => {
  const results = await db.select({
    candidate_id: votes.candidate_id,
    votes_count: sql`count(${votes.id})`,
  })
  .from(votes)
  .where(eq(votes.election_id, election_id))
  .groupBy(votes.candidate_id);

  return results;
};
