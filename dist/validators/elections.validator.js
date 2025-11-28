"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElectionsByStatusValidator = exports.changeElectionStatusValidator = exports.electionValidator = void 0;
// src/validators/elections.validator.ts
const zod_1 = require("zod");
// -------------------------------
// Create / Update Election Validator
// -------------------------------
exports.electionValidator = zod_1.z.object({
    name: zod_1.z.string().min(3, "Election name must be at least 3 characters"),
    start_date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "start_date must be a valid date string",
    }),
    end_date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "end_date must be a valid date string",
    }),
    created_by: zod_1.z.string().uuid("created_by must be a valid UUID"),
    status: zod_1.z
        .enum(["upcoming", "ongoing", "finished"])
        .optional(), // Optional for creation; default is 'upcoming'
});
// -------------------------------
// Change Election Status Validator
// -------------------------------
exports.changeElectionStatusValidator = zod_1.z.object({
    status: zod_1.z.enum(["upcoming", "ongoing", "finished"]),
});
// -------------------------------
// Get Elections by Status Validator
// -------------------------------
exports.getElectionsByStatusValidator = zod_1.z.object({
    status: zod_1.z.enum(["upcoming", "ongoing", "finished"]),
});
