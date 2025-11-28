"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVoteCountsByElection = exports.getVotesByElection = exports.getVotesByCandidate = exports.castVote = void 0;
const votes_service_1 = require("./votes.service");
const Vote_validator_1 = require("../../validators/Vote.validator");
// -------------------------------
// Cast a vote
// -------------------------------
const castVote = async (req, res) => {
    const parseResult = Vote_validator_1.castVoteValidator.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { candidate_id, position_id, election_id } = parseResult.data;
        const voteData = {
            candidate_id,
            position_id,
            election_id,
            voter_id: req.user.id,
        };
        const vote = await (0, votes_service_1.castVoteService)(voteData);
        res.status(201).json({ message: "Vote cast successfully", vote });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.castVote = castVote;
// -------------------------------
// Get all votes for a candidate (admin only)
// -------------------------------
const getVotesByCandidate = async (req, res) => {
    const parseResult = Vote_validator_1.getVotesByCandidateValidator.safeParse(req.params);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { candidate_id } = parseResult.data;
        const votes = await (0, votes_service_1.getVotesByCandidateService)(candidate_id);
        res.status(200).json({ votes });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVotesByCandidate = getVotesByCandidate;
// -------------------------------
// Get all votes for an election (admin only)
// -------------------------------
const getVotesByElection = async (req, res) => {
    const parseResult = Vote_validator_1.getVotesByElectionValidator.safeParse(req.params);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { election_id } = parseResult.data;
        const votes = await (0, votes_service_1.getVotesByElectionService)(election_id);
        res.status(200).json({ votes });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVotesByElection = getVotesByElection;
// -------------------------------
// Get aggregated vote counts for an election (public)
// -------------------------------
const getVoteCountsByElection = async (req, res) => {
    const parseResult = Vote_validator_1.getVoteCountsByElectionValidator.safeParse(req.params);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { election_id } = parseResult.data;
        const counts = await (0, votes_service_1.getVoteCountsByElectionService)(election_id);
        res.status(200).json({ counts });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVoteCountsByElection = getVoteCountsByElection;
