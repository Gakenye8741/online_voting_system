"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElectionsByStatus = exports.changeElectionStatus = exports.deleteElection = exports.updateElection = exports.getElectionById = exports.getAllElections = exports.createElection = void 0;
const elections_service_1 = require("./elections.service");
const elections_validator_1 = require("../../validators/elections.validator");
// -------------------------------
// Create a new election
// -------------------------------
const createElection = async (req, res) => {
    const parseResult = elections_validator_1.electionValidator.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const parsed = parseResult.data;
        const electionData = {
            ...parsed,
            start_date: new Date(parsed.start_date),
            end_date: new Date(parsed.end_date),
        };
        const newElection = await (0, elections_service_1.createElectionService)(electionData);
        res.status(201).json({ message: "Election created successfully", election: newElection });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create election" });
    }
};
exports.createElection = createElection;
// -------------------------------
// Get all elections
// -------------------------------
const getAllElections = async (_req, res) => {
    try {
        const elections = await (0, elections_service_1.getAllElectionsService)();
        res.status(200).json({ elections });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch elections" });
    }
};
exports.getAllElections = getAllElections;
// -------------------------------
// Get election by ID
// -------------------------------
const getElectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const election = await (0, elections_service_1.getElectionByIdService)(id);
        if (!election)
            return res.status(404).json({ error: "Election not found" });
        res.status(200).json({ election });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch election" });
    }
};
exports.getElectionById = getElectionById;
// -------------------------------
// Update an election
// -------------------------------
const updateElection = async (req, res) => {
    const parseResult = elections_validator_1.electionValidator.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { id } = req.params;
        const parsed = parseResult.data;
        const updates = {
            ...parsed,
            start_date: parsed.start_date ? new Date(parsed.start_date) : undefined,
            end_date: parsed.end_date ? new Date(parsed.end_date) : undefined,
        };
        const updatedElection = await (0, elections_service_1.updateElectionService)(id, updates);
        if (!updatedElection)
            return res.status(404).json({ error: "Election not found or update failed" });
        res.status(200).json({ message: "Election updated successfully", election: updatedElection });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update election" });
    }
};
exports.updateElection = updateElection;
// -------------------------------
// Delete an election
// -------------------------------
const deleteElection = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await (0, elections_service_1.deleteElectionService)(id);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete election" });
    }
};
exports.deleteElection = deleteElection;
// -------------------------------
// Change election status
// -------------------------------
const changeElectionStatus = async (req, res) => {
    const parseResult = elections_validator_1.changeElectionStatusValidator.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { id } = req.params;
        const { status } = parseResult.data;
        const updatedElection = await (0, elections_service_1.changeElectionStatusService)(id, status);
        if (!updatedElection)
            return res.status(404).json({ error: "Election not found or update failed" });
        res.status(200).json({ message: "Election status updated", election: updatedElection });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update election status" });
    }
};
exports.changeElectionStatus = changeElectionStatus;
// -------------------------------
// Get elections by status
// -------------------------------
const getElectionsByStatus = async (req, res) => {
    const parseResult = elections_validator_1.getElectionsByStatusValidator.safeParse(req.query);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.issues });
    }
    try {
        const { status } = parseResult.data;
        const elections = await (0, elections_service_1.getElectionsByStatusService)(status);
        res.status(200).json({ elections });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch elections by status" });
    }
};
exports.getElectionsByStatus = getElectionsByStatus;
