import { Router } from "express";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidatesByName,
  getCandidatesBySchool,
  getCandidatesByPosition,
  getCandidatesByCoalition,
  updateCandidate,
  deleteCandidate,
  getCandidatesCount,
  getCandidatesCountBySchool,
} from "./candidates.controller";

import { adminAuth, anyAuthenticatedUser } from "../../middlewares/bearAuth";

const CandidatesRouter = Router();

// --------------------------------
// Public Routes
// --------------------------------

// Get all candidates
CandidatesRouter.get("/", anyAuthenticatedUser, getAllCandidates);

// Get candidate by ID
CandidatesRouter.get("/by-id/:id", anyAuthenticatedUser, getCandidateById);

// Search candidates by name (?name=John)
CandidatesRouter.get("/by-name", anyAuthenticatedUser, getCandidatesByName);

// Get candidates by school (?school=Science)
CandidatesRouter.get("/by-school", anyAuthenticatedUser, getCandidatesBySchool);

// Get candidates by position (?position_id=xxxx)
CandidatesRouter.get("/by-position", anyAuthenticatedUser, getCandidatesByPosition);

// Get candidates by coalition (?coalition_id=xxxx)
CandidatesRouter.get("/by-coalition", anyAuthenticatedUser, getCandidatesByCoalition);

// --------------------------------
// Counts
// --------------------------------

// Get total candidates count
CandidatesRouter.get("/count", adminAuth, getCandidatesCount);

// Get total candidates count by school (?school=Science)
CandidatesRouter.get("/count-by-school", adminAuth, getCandidatesCountBySchool);

// --------------------------------
// Admin-Protected Routes
// --------------------------------

// Create a new candidate
CandidatesRouter.post("/create", adminAuth, createCandidate);

// Update candidate
CandidatesRouter.put("/update/:id", anyAuthenticatedUser, updateCandidate);

// Delete candidate
CandidatesRouter.delete("/delete/:id", adminAuth, deleteCandidate);

export default CandidatesRouter;
