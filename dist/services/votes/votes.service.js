"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVoteCountsByElectionService = exports.getVotesByElectionService = exports.getVotesByCandidateService = exports.castVoteService = void 0;
const db_1 = __importDefault(require("../../drizzle/db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const BlockChain_service_1 = require("../BlockChain/BlockChain.service");
// -------------------------------
// Cast a vote
// -------------------------------
const castVoteService = async (voteData) => {
    // Prevent double voting per position
    const existingVote = await db_1.default.query.votes.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.votes.voter_id, voteData.voter_id), (0, drizzle_orm_1.eq)(schema_1.votes.position_id, voteData.position_id)),
    });
    if (existingVote)
        throw new Error("You have already voted for this position");
    const [newVote] = await db_1.default.insert(schema_1.votes).values(voteData).returning();
    if (!newVote)
        throw new Error("Failed to cast vote");
    // Create blockchain block
    await (0, BlockChain_service_1.createBlockFromVote)(newVote);
    return newVote;
};
exports.castVoteService = castVoteService;
// -------------------------------
// Get all votes for a candidate (admin)
// -------------------------------
const getVotesByCandidateService = async (candidate_id) => {
    return db_1.default.query.votes.findMany({ where: (0, drizzle_orm_1.eq)(schema_1.votes.candidate_id, candidate_id) });
};
exports.getVotesByCandidateService = getVotesByCandidateService;
// -------------------------------
// Get all votes for an election (admin)
// -------------------------------
const getVotesByElectionService = async (election_id) => {
    return db_1.default.query.votes.findMany({ where: (0, drizzle_orm_1.eq)(schema_1.votes.election_id, election_id) });
};
exports.getVotesByElectionService = getVotesByElectionService;
// -------------------------------
// Get aggregated vote counts for an election (public)
// -------------------------------
const getVoteCountsByElectionService = async (election_id) => {
    const results = await db_1.default.select({
        candidate_id: schema_1.votes.candidate_id,
        votes_count: (0, drizzle_orm_1.sql) `count(${schema_1.votes.id})`,
    })
        .from(schema_1.votes)
        .where((0, drizzle_orm_1.eq)(schema_1.votes.election_id, election_id))
        .groupBy(schema_1.votes.candidate_id);
    return results;
};
exports.getVoteCountsByElectionService = getVoteCountsByElectionService;
