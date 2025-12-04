import { Request, Response, RequestHandler } from "express";
import {
  createCandidateService,
  getAllCandidatesService,
  getCandidateByIdService,
  getCandidatesByNameService,
  getCandidatesBySchoolService,
  getCandidatesByPositionService,
  getCandidatesByCoalitionService,
  getCandidatesCountService,
  getCandidatesCountBySchoolService,
  updateCandidateService,
  deleteCandidateService,
  getCandidatesByElectionService,
} from "./candidates.service";

import { CandidateInsert, CandidateSelect } from "../../drizzle/schema";

// -------------------------------
// Create a new candidate
// -------------------------------
export const createCandidate: RequestHandler = async (req, res) => {
  try {
    const data: CandidateInsert = req.body;

    const newCandidate = await createCandidateService(data);

    res.status(201).json({
      message: "Candidate created successfully",
      candidate: newCandidate,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create candidate" });
  }
};

// -------------------------------
// Get all candidates
// -------------------------------
export const getAllCandidates: RequestHandler = async (req, res) => {
  try {
    const candidates: CandidateSelect[] = await getAllCandidatesService();

    if (candidates.length > 0) {
      res.status(200).json({ candidates });
    } else {
      res.status(404).json({ message: "No candidates found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates" });
  }
};

// -------------------------------
// Get candidate by ID
// -------------------------------
export const getCandidateById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await getCandidateByIdService(id);

    if (candidate) {
      res.status(200).json({ candidate });
    } else {
      res.status(404).json({ error: "Candidate not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidate" });
  }
};

// -------------------------------
// Search candidates by name
// -------------------------------
export const getCandidatesByName: RequestHandler = async (req, res) => {
  try {
    const { name } = req.query;

    if (typeof name !== "string") {
      return res.status(400).json({ error: "name query parameter is required" });
    }

    const candidates = await getCandidatesByNameService(name);

    if (candidates.length > 0) {
      res.status(200).json({ candidates });
    } else {
      res.status(404).json({ message: "No candidates found with that name" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to search candidates" });
  }
};

// -------------------------------
// Get candidates by school
// -------------------------------
export const getCandidatesBySchool: RequestHandler = async (req, res) => {
  try {
    const { school } = req.query;

    if (typeof school !== "string") {
      return res.status(400).json({ error: "school query parameter is required" });
    }

    const allowedSchools = [
      "Science",
      "Education",
      "Business",
      "Humanities and Developmental_Studies",
      "TVET",
    ] as const;

    type School = typeof allowedSchools[number];

    if (!allowedSchools.includes(school as School)) {
      return res.status(400).json({
        error: `school must be one of: ${allowedSchools.join(", ")}`,
      });
    }

    const candidates = await getCandidatesBySchoolService(school as School);

    if (candidates.length > 0) {
      res.status(200).json({ candidates });
    } else {
      res.status(404).json({ message: "No candidates found for this school" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates" });
  }
};

// -------------------------------
// Get candidates by position ID
// -------------------------------
export const getCandidatesByPosition: RequestHandler = async (req, res) => {
  try {
    const { position_id } = req.query;

    if (typeof position_id !== "string") {
      return res.status(400).json({ error: "position_id query parameter is required" });
    }

    const candidates = await getCandidatesByPositionService(position_id);

    if (candidates.length > 0) {
      res.status(200).json({ candidates });
    } else {
      res.status(404).json({ message: "No candidates found for this position" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates" });
  }
};

// -------------------------------
// Get candidates by coalition
// -------------------------------
export const getCandidatesByCoalition: RequestHandler = async (req, res) => {
  try {
    const { coalition_id } = req.query;

    if (typeof coalition_id !== "string") {
      return res.status(400).json({ error: "coalition_id query parameter is required" });
    }

    const candidates = await getCandidatesByCoalitionService(coalition_id);

    if (candidates.length > 0) {
      res.status(200).json({ candidates });
    } else {
      res.status(404).json({ message: "No candidates found for this coalition" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates" });
  }
};

// -------------------------------
// Update a candidate
// -------------------------------
export const updateCandidate: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates: Partial<CandidateInsert> = req.body;

    const updatedCandidate = await updateCandidateService(id, updates);

    if (updatedCandidate) {
      res.status(200).json({
        message: "Candidate updated successfully",
        candidate: updatedCandidate,
      });
    } else {
      res.status(404).json({ error: "Candidate not found or update failed" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update candidate" });
  }
};

// -------------------------------
// Delete a candidate
// -------------------------------
export const deleteCandidate: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await deleteCandidateService(id);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete candidate" });
  }
};

// -------------------------------
// Get total candidates count
// -------------------------------
export const getCandidatesCount: RequestHandler = async (req, res) => {
  try {
    const count = await getCandidatesCountService();

    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates count" });
  }
};

// -------------------------------
// Get candidates count by school
// -------------------------------
export const getCandidatesCountBySchool: RequestHandler = async (req, res) => {
  try {
    const { school } = req.query;

    if (typeof school !== "string") {
      return res.status(400).json({ error: "school query parameter is required" });
    }

    const allowedSchools = [
      "Science",
      "Education",
      "Business",
      "Humanities and Developmental_Studies",
      "TVET",
    ] as const;

    type School = typeof allowedSchools[number];

    if (!allowedSchools.includes(school as School)) {
      return res
        .status(400)
        .json({ error: `school must be one of: ${allowedSchools.join(", ")}` });
    }

    const count = await getCandidatesCountBySchoolService(school as School);

    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates count" });
  }
};

/**
 * Get all candidates for a specific election
 * Route: GET /candidates/election/:electionId
 */
export const getCandidatesByElection: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;

    if (!electionId) {
      return res.status(400).json({ error: "Election ID is required" });
    }

    const candidates: CandidateSelect[] = await getCandidatesByElectionService(electionId);

    if (candidates.length > 0) {
      res.status(200).json({ candidates });
    } else {
      res.status(404).json({ message: "No candidates found for this election" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidates for election" });
  }
};
