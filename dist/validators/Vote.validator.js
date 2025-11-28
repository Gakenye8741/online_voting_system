"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVoteCountsByElectionValidator = exports.getVotesByElectionValidator = exports.getVotesByCandidateValidator = exports.castVoteValidator = void 0;
const zod_1 = require("zod");
// -------------------------------
// Validator for casting a vote
// -------------------------------
exports.castVoteValidator = zod_1.z.object({
    candidate_id: zod_1.z.string().uuid({ message: "Invalid candidate ID" }),
    position_id: zod_1.z.string().uuid({ message: "Invalid position ID" }),
    election_id: zod_1.z.string().uuid({ message: "Invalid election ID" }),
});
// -------------------------------
// Validator for query params / route params
// -------------------------------
exports.getVotesByCandidateValidator = zod_1.z.object({
    candidate_id: zod_1.z.string().uuid({ message: "Invalid candidate ID" }),
});
exports.getVotesByElectionValidator = zod_1.z.object({
    election_id: zod_1.z.string().uuid({ message: "Invalid election ID" }),
});
// -------------------------------
// Validator for public aggregated vote counts
// -------------------------------
exports.getVoteCountsByElectionValidator = zod_1.z.object({
    election_id: zod_1.z.string().uuid({ message: "Invalid election ID" }),
});
