import { RequestHandler } from "express";
import {
  createElectionService,
  getAllElectionsService,
  getElectionByIdService,
  updateElectionService,
  deleteElectionService,
  changeElectionStatusService,
  getElectionsByStatusService,
} from "./elections.service";
import { ElectionInsert, ElectionSelect, electionStatus } from "../../drizzle/schema";
import {
  electionValidator,
  changeElectionStatusValidator,
  getElectionsByStatusValidator,
} from "../../validators/elections.validator";

// Type helper for election status
type ElectionStatus = typeof electionStatus.enumValues[number];

// -------------------------------
// Create a new election
// -------------------------------
export const createElection: RequestHandler = async (req, res) => {
  const parseResult = electionValidator.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const parsed = parseResult.data;
    const electionData: ElectionInsert = {
      ...parsed,
      start_date: new Date(parsed.start_date),
      end_date: new Date(parsed.end_date),
    };
    const newElection: ElectionSelect = await createElectionService(electionData);
    res.status(201).json({ message: "Election created successfully", election: newElection });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create election" });
  }
};

// -------------------------------
// Get all elections
// -------------------------------
export const getAllElections: RequestHandler = async (_req, res) => {
  try {
    const elections = await getAllElectionsService();
    res.status(200).json({ elections });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch elections" });
  }
};

// -------------------------------
// Get election by ID
// -------------------------------
export const getElectionById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await getElectionByIdService(id);
    if (!election) return res.status(404).json({ error: "Election not found" });
    res.status(200).json({ election });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch election" });
  }
};

// -------------------------------
// Update an election
// -------------------------------
export const updateElection: RequestHandler = async (req, res) => {
  const parseResult = electionValidator.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { id } = req.params;
    const parsed = parseResult.data;
    const updates: Partial<ElectionInsert> = {
      ...parsed,
      start_date: parsed.start_date ? new Date(parsed.start_date) : undefined,
      end_date: parsed.end_date ? new Date(parsed.end_date) : undefined,
    };
    const updatedElection = await updateElectionService(id, updates);
    if (!updatedElection) return res.status(404).json({ error: "Election not found or update failed" });
    res.status(200).json({ message: "Election updated successfully", election: updatedElection });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update election" });
  }
};

// -------------------------------
// Delete an election
// -------------------------------
export const deleteElection: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await deleteElectionService(id);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete election" });
  }
};

// -------------------------------
// Change election status
// -------------------------------
export const changeElectionStatus: RequestHandler = async (req, res) => {
  const parseResult = changeElectionStatusValidator.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { id } = req.params;
    const { status } = parseResult.data;
    const updatedElection = await changeElectionStatusService(id, status as ElectionStatus);
    if (!updatedElection) return res.status(404).json({ error: "Election not found or update failed" });
    res.status(200).json({ message: "Election status updated", election: updatedElection });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update election status" });
  }
};

// -------------------------------
// Get elections by status
// -------------------------------
export const getElectionsByStatus: RequestHandler = async (req, res) => {
  const parseResult = getElectionsByStatusValidator.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const { status } = parseResult.data;
    const elections = await getElectionsByStatusService(status as ElectionStatus);
    res.status(200).json({ elections });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch elections by status" });
  }
};
