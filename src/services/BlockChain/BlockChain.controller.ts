import { RequestHandler } from "express";
import db from "../../drizzle/db";
import { blockchain } from "../../drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { computeHash } from "./BlockChain.service";

// ----------------------------------------------
// GET FULL BLOCKCHAIN OF AN ELECTION
// ----------------------------------------------
export const getElectionBlockchain: RequestHandler = async (req, res) => {
  try {
    const { election_id } = req.params;

    if (!election_id) {
      return res.status(400).json({
        error: "Election ID is required",
      });
    }

    // Fetch blocks sorted by index
    const blocks = await db.query.blockchain.findMany({
      where: eq(blockchain.election_id, election_id),
      orderBy: [asc(blockchain.index)],
    });

    // Optional: check chain integrity
    let isValid = true;

    for (let i = 1; i < blocks.length; i++) {
      const prev = blocks[i - 1];
      const current = blocks[i];

      const expectedHash = computeHash(
        `${current.index}${current.voter_hash}${current.candidate_id}${current.position_id}${current.election_id}${current.previous_hash}${current.timestamp}`
      );

      if (current.previous_hash !== prev.hash || current.hash !== expectedHash) {
        isValid = false;
        break;
      }
    }

    res.status(200).json({
      election_id,
      blocks,
      chain_valid: isValid,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to load blockchain",
    });
  }
};
