"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const votes_controller_1 = require("./votes.controller");
const bearAuth_1 = require("../../middlewares/bearAuth");
const VotesRouter = (0, express_1.Router)();
// -------------------------------
// Cast a vote (any authenticated user)
VotesRouter.post("/", bearAuth_1.anyAuthenticatedUser, votes_controller_1.castVote);
// -------------------------------
// Get votes for a specific candidate (admin only)
VotesRouter.get("/candidate/:candidate_id", bearAuth_1.adminAuth, votes_controller_1.getVotesByCandidate);
// -------------------------------
// Get votes for a specific election (admin only)
VotesRouter.get("/election/:election_id", bearAuth_1.adminAuth, votes_controller_1.getVotesByElection);
// -------------------------------
// Get aggregated vote counts for a specific election (public)
VotesRouter.get("/counts/:election_id", bearAuth_1.anyAuthenticatedUser, votes_controller_1.getVoteCountsByElection);
exports.default = VotesRouter;
