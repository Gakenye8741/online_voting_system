// elections.routes.ts
import { Router } from "express";
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  changeElectionStatus,
  getElectionsByStatus,
} from "./elections.controller";
import { adminAuth, anyAuthenticatedUser, authMiddleware } from "../../middlewares/bearAuth";

const ElectionRouter = Router();

// -------------------------------
// Election CRUD (Admins only)
// -------------------------------
ElectionRouter.post("/", adminAuth, createElection);
ElectionRouter.get("/", anyAuthenticatedUser, getAllElections);
ElectionRouter.get("/:id", anyAuthenticatedUser, getElectionById);
ElectionRouter.put("/:id", adminAuth, updateElection);
ElectionRouter.delete("/:id", adminAuth, deleteElection);

// -------------------------------
// Election status
// -------------------------------
ElectionRouter.patch("/:id/status", adminAuth, changeElectionStatus);
ElectionRouter.get("/status/filter", anyAuthenticatedUser, getElectionsByStatus);

export default ElectionRouter;
