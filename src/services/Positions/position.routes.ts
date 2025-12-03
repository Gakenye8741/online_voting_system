import { Router } from "express";
import {
  createPosition,
  getAllPositions,
  getPositionById,
  getPositionsByName,
  getPositionsBySchool,
  getPositionsByTier,
  getPositionsByElectionId,
  updatePosition,
  deletePosition,
  getPositionsCount,
  getPositionsCountBySchool,
} from "./position.controller";

import { adminAuth, anyAuthenticatedUser } from "../../middlewares/bearAuth";

const PositionsRouter = Router();

// -------------------------------
// Public/Admin Routes
// -------------------------------

// Create a new position
PositionsRouter.post("/create", adminAuth, createPosition);

// Get all positions
PositionsRouter.get("/", adminAuth, getAllPositions);

// Get position by ID
PositionsRouter.get("/by-id/:id", anyAuthenticatedUser, getPositionById);

// Get positions by name (?name=President)
PositionsRouter.get("/by-name", anyAuthenticatedUser, getPositionsByName);

// Get positions by school (?school=Science)
PositionsRouter.get("/by-school", anyAuthenticatedUser, getPositionsBySchool);

// Get positions by tier (?tier=school)
PositionsRouter.get("/by-tier", anyAuthenticatedUser, getPositionsByTier);

// Get positions by election ID (?election_id=12345)
PositionsRouter.get("/by-election", anyAuthenticatedUser, getPositionsByElectionId);

// -------------------------------
// Count Routes
// -------------------------------

// Get total positions count
PositionsRouter.get("/count", anyAuthenticatedUser, getPositionsCount);

// Get total positions count by school (?school=Science)
PositionsRouter.get("/count-by-school", anyAuthenticatedUser, getPositionsCountBySchool);

// -------------------------------
// Protected Routes
// -------------------------------

// Update position by ID
PositionsRouter.put("/update/:id", adminAuth, updatePosition);

// Delete position by ID
PositionsRouter.delete("/delete/:id", adminAuth, deletePosition);

export default PositionsRouter;
