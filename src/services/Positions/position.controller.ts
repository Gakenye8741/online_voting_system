import { Request, Response, RequestHandler } from "express";
import {
  getAllPositionsService,
  getPositionByIdService,
  getPositionsByNameService,
  getPositionsBySchoolService,
  getPositionsByTierService,
  getPositionsByElectionIdService,
  getPositionsCountService,
  getPositionsCountBySchoolService,
  updatePositionService,
  deletePositionService,
  createPositionService,
} from "./position.service";

import { PositionSelect, PositionInsert } from "../../drizzle/schema";


// -------------------------------
// Create new position
// -------------------------------
export const createPosition: RequestHandler = async (req, res) => {
  try {
    const data: PositionInsert = req.body;

    const newPosition = await createPositionService(data);

    res.status(201).json({
      message: "Position created successfully",
      position: newPosition,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create position" });
  }
};


// -------------------------------
// Get all positions
// -------------------------------
export const getAllPositions: RequestHandler = async (req, res) => {
  try {
    const positions: PositionSelect[] = await getAllPositionsService();
    if (positions.length > 0) {
      res.status(200).json({ positions });
    } else {
      res.status(404).json({ message: "No positions found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions" });
  }
};

// -------------------------------
// Get position by ID
// -------------------------------
export const getPositionById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const position: PositionSelect | undefined = await getPositionByIdService(id);

    if (position) {
      res.status(200).json({ position });
    } else {
      res.status(404).json({ error: "Position not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch position" });
  }
};

// -------------------------------
// Get positions by name (search)
// -------------------------------
export const getPositionsByName: RequestHandler = async (req, res) => {
  try {
    const { name } = req.query;
    if (typeof name !== "string") {
      return res.status(400).json({ error: "name query parameter is required" });
    }

    const positions: PositionSelect[] = await getPositionsByNameService(name);

    if (positions.length > 0) {
      res.status(200).json({ positions });
    } else {
      res.status(404).json({ message: "No positions found with that name" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions" });
  }
};

// -------------------------------
// Get positions by school
// -------------------------------
export const getPositionsBySchool: RequestHandler = async (req, res) => {
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

    const positions: PositionSelect[] = await getPositionsBySchoolService(school as School);

    if (positions.length > 0) {
      res.status(200).json({ positions });
    } else {
      res.status(404).json({ message: "No positions found for this school" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions" });
  }
};

// -------------------------------
// Get positions by tier
// -------------------------------
export const getPositionsByTier: RequestHandler = async (req, res) => {
  try {
    const { tier } = req.query;
    if (typeof tier !== "string") {
      return res.status(400).json({ error: "tier query parameter is required" });
    }

    const allowedTiers = ["school", "university"] as const;
    type Tier = typeof allowedTiers[number];

    if (!allowedTiers.includes(tier as Tier)) {
      return res
        .status(400)
        .json({ error: `tier must be one of: ${allowedTiers.join(", ")}` });
    }

    const positions: PositionSelect[] = await getPositionsByTierService(tier as Tier);

    if (positions.length > 0) {
      res.status(200).json({ positions });
    } else {
      res.status(404).json({ message: "No positions found for this tier" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions" });
  }
};

// -------------------------------
// Get positions by election ID
// -------------------------------
export const getPositionsByElectionId: RequestHandler = async (req, res) => {
  try {
    const { election_id } = req.query;
    if (typeof election_id !== "string") {
      return res.status(400).json({ error: "election_id query parameter is required" });
    }

    const positions: PositionSelect[] = await getPositionsByElectionIdService(election_id);

    if (positions.length > 0) {
      res.status(200).json({ positions });
    } else {
      res.status(404).json({ message: "No positions found for this election" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions" });
  }
};

// -------------------------------
// Update position
// -------------------------------
export const updatePosition: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates: Partial<PositionSelect> = req.body;

    const updatedPosition: PositionSelect | null = await updatePositionService(id, updates);

    if (updatedPosition) {
      res.status(200).json({
        message: "Position updated successfully",
        position: updatedPosition,
      });
    } else {
      res.status(404).json({ error: "Position not found or update failed" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update position" });
  }
};

// -------------------------------
// Delete position
// -------------------------------
export const deletePosition: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const message: string = await deletePositionService(id);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete position" });
  }
};

// -------------------------------
// Get total positions count
// -------------------------------
export const getPositionsCount: RequestHandler = async (req, res) => {
  try {
    const count: number = await getPositionsCountService();
    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions count" });
  }
};

// -------------------------------
// Get total positions count by school
// -------------------------------
export const getPositionsCountBySchool: RequestHandler = async (req, res) => {
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

    const count: number = await getPositionsCountBySchoolService(school as School);
    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch positions count" });
  }
};
