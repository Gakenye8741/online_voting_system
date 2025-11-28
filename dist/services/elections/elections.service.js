"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoUpdateElectionStatusService = exports.getElectionsByStatusService = exports.changeElectionStatusService = exports.deleteElectionService = exports.updateElectionService = exports.getElectionByIdService = exports.getAllElectionsService = exports.createElectionService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../drizzle/db"));
const schema_1 = require("../../drizzle/schema");
// -------------------------------
// Create a new election
// -------------------------------
const createElectionService = async (electionData) => {
    const [newElection] = await db_1.default.insert(schema_1.elections)
        .values(electionData)
        .returning();
    if (!newElection)
        throw new Error("Failed to create election");
    return newElection;
};
exports.createElectionService = createElectionService;
// -------------------------------
// Get all elections
// -------------------------------
const getAllElectionsService = async () => {
    return db_1.default.query.elections.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.elections.start_date)],
    });
};
exports.getAllElectionsService = getAllElectionsService;
// -------------------------------
// Get election by ID
// -------------------------------
const getElectionByIdService = async (id) => {
    return db_1.default.query.elections.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.elections.id, id) });
};
exports.getElectionByIdService = getElectionByIdService;
// -------------------------------
// Update an election
// -------------------------------
const updateElectionService = async (id, updates) => {
    const [updatedElection] = await db_1.default.update(schema_1.elections)
        .set(updates)
        .where((0, drizzle_orm_1.eq)(schema_1.elections.id, id))
        .returning();
    return updatedElection ?? null;
};
exports.updateElectionService = updateElectionService;
// -------------------------------
// Delete an election
// -------------------------------
const deleteElectionService = async (id) => {
    await db_1.default.delete(schema_1.elections).where((0, drizzle_orm_1.eq)(schema_1.elections.id, id));
    return "Election deleted successfully";
};
exports.deleteElectionService = deleteElectionService;
// -------------------------------
// Change election status explicitly
// -------------------------------
const changeElectionStatusService = async (id, status) => {
    const [updatedElection] = await db_1.default.update(schema_1.elections)
        .set({ status })
        .where((0, drizzle_orm_1.eq)(schema_1.elections.id, id))
        .returning();
    return updatedElection ?? null;
};
exports.changeElectionStatusService = changeElectionStatusService;
// -------------------------------
// Get elections by status
// -------------------------------
const getElectionsByStatusService = async (status) => {
    return db_1.default.query.elections.findMany({ where: (0, drizzle_orm_1.eq)(schema_1.elections.status, status) });
};
exports.getElectionsByStatusService = getElectionsByStatusService;
// -------------------------------
// Auto-update all elections based on current date
// -------------------------------
const autoUpdateElectionStatusService = async () => {
    const now = new Date();
    const allElections = await db_1.default.query.elections.findMany();
    for (const election of allElections) {
        let newStatus = election.status;
        if (now < new Date(election.start_date)) {
            newStatus = "upcoming";
        }
        else if (now >= new Date(election.start_date) && now <= new Date(election.end_date)) {
            newStatus = "ongoing";
        }
        else if (now > new Date(election.end_date)) {
            newStatus = "finished";
        }
        if (newStatus !== election.status) {
            await db_1.default.update(schema_1.elections)
                .set({ status: newStatus })
                .where((0, drizzle_orm_1.eq)(schema_1.elections.id, election.id));
        }
    }
};
exports.autoUpdateElectionStatusService = autoUpdateElectionStatusService;
