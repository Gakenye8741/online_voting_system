import { Request, Response } from "express";
import {
  createCandidateApplicationService,
  getAllCandidateApplicationsService,
  getCandidateApplicationByIdService,
  getCandidateApplicationsByUserService,
  getPendingApplicationsForApproverService,
  updateCandidateApplicationStatusService,
  deleteCandidateApplicationService,
} from "./candidateApplications.service";

/* ================================
   CREATE – Submit Candidate Application
   Now requires election_id in the request body
================================ */
export const createCandidateApplicationController = async (req: Request, res: Response) => {
  try {
    const { student_id, position_id, manifesto, documents_url, school, election_id } = req.body;

    if (!election_id) {
      return res.status(400).json({ error: "Election ID is required" });
    }

    const application = await createCandidateApplicationService({
      student_id,
      position_id,
      manifesto,
      documents_url,
      school,
      election_id, // ✅ include election_id
    });

    res.status(201).json({
      message: "Candidate application created successfully",
      application,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ================================
   READ – All Applications
================================ */
export const getAllCandidateApplicationsController = async (req: Request, res: Response) => {
  try {
    const applications = await getAllCandidateApplicationsService();
    res.status(200).json(applications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   READ – Application by ID
================================ */
export const getCandidateApplicationByIdController = async (req: Request, res: Response) => {
  try {
    const application = await getCandidateApplicationByIdService(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.status(200).json(application);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   READ – Applications by User
================================ */
export const getCandidateApplicationsByUserController = async (req: Request, res: Response) => {
  try {
    const applications = await getCandidateApplicationsByUserService(req.params.userId);
    res.status(200).json(applications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   READ – Pending Applications for Approver
================================ */
export const getPendingApplicationsForApproverController = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as "school_dean" | "accounts" | "dean_of_students";
    const applications = await getPendingApplicationsForApproverService(role);
    res.status(200).json(applications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   UPDATE – Approve/Reject Application
   Automatically creates candidate with election_id after approval
================================ */
export const updateCandidateApplicationStatusController = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { approverRole, approverId, status, comment } = req.body;

    const updatedApplication = await updateCandidateApplicationStatusService(
      applicationId,
      approverRole,
      approverId,
      status,
      comment
    );

    if (!updatedApplication) return res.status(404).json({ error: "Application not found" });

    res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ================================
   DELETE – Remove Application
================================ */
export const deleteCandidateApplicationController = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const message = await deleteCandidateApplicationService(applicationId);
    res.status(200).json({ message });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
