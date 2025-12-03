// candidateApplications.routes.ts
import { Router } from "express";
import {
  createCandidateApplicationController,
  updateCandidateApplicationStatusController,
  getAllCandidateApplicationsController,
  getCandidateApplicationByIdController,
  getCandidateApplicationsByUserController,
  getPendingApplicationsForApproverController,
  deleteCandidateApplicationController,
} from "./candidateApplications.controller";
import { adminAuth, anyAuthenticatedUser } from "../../middlewares/bearAuth";

const CandidateApplicationsRouter = Router();

// -------------------------------
// Candidate Applications CRUD
// -------------------------------

// Create a new application (Students only)
CandidateApplicationsRouter.post(
  "/",
  anyAuthenticatedUser,
  createCandidateApplicationController
);

// Get all applications (Admin/Approver)
CandidateApplicationsRouter.get(
  "/",
  anyAuthenticatedUser,
  getAllCandidateApplicationsController
);

// Get all applications for the logged-in student
CandidateApplicationsRouter.get(
  "/student/me",
  anyAuthenticatedUser,
  async (req, res) => {
    const userId = (req as any).user?.id; // assuming user ID is attached to req.user
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    await getCandidateApplicationsByUserController({ params: { userId } } as any, res);
  }
);

// Get a specific application by ID
CandidateApplicationsRouter.get(
  "/:id",
  anyAuthenticatedUser,
  getCandidateApplicationByIdController
);

// Update an application (Approver/Admin)
CandidateApplicationsRouter.put(
  "/:applicationId",
  anyAuthenticatedUser,
  updateCandidateApplicationStatusController
);

// Delete an application (Admin only)
CandidateApplicationsRouter.delete(
  "/:applicationId",
  adminAuth,
  deleteCandidateApplicationController
);

// Get pending applications for approver (Admin/Approver)
CandidateApplicationsRouter.get(
  "/pending/approver",
  anyAuthenticatedUser,
  getPendingApplicationsForApproverController
);

export default CandidateApplicationsRouter;
