import db from "../../drizzle/db";
import { eq, desc } from "drizzle-orm";
import {
  candidate_applications,
  candidates,
  CandidateApplicationInsert,
  CandidateApplicationSelect,
  users,
  approvalStatus,
  School,
} from "../../drizzle/schema";
import { validateCandidateApplication } from "../../validators/Applications.validator";

/* ================================
   Type Helpers
================================ */
type ApprovalStatusType = typeof approvalStatus.enumValues[number];
type SchoolType = typeof School.enumValues[number];

/* ================================
   CREATE – Submit Candidate Application
================================ */
export const createCandidateApplicationService = async (
  applicationData: CandidateApplicationInsert
): Promise<CandidateApplicationSelect> => {
  // Validate input
  const validation = validateCandidateApplication(applicationData);
  if (!validation.valid) throw new Error(JSON.stringify(validation.errors));

  // Check for duplicate
  const existing = await db.query.candidate_applications.findFirst({
    where: eq(candidate_applications.student_id, applicationData.student_id),
  });
  if (existing) throw new Error("You have already applied for this position");

  const [newApplication] = await db.insert(candidate_applications)
    .values({
      ...applicationData,
      overall_status: "PENDING",
    })
    .returning();

  if (!newApplication) throw new Error("Failed to create candidate application");
  return newApplication;
};

/* ================================
   READ – Fetch Applications
================================ */
export const getAllCandidateApplicationsService = async (): Promise<CandidateApplicationSelect[]> => {
  return db.query.candidate_applications.findMany({
    orderBy: [desc(candidate_applications.created_at)],
  });
};

export const getCandidateApplicationByIdService = async (
  id: string
): Promise<CandidateApplicationSelect | null> => {
  return (
    await db.query.candidate_applications.findFirst({
      where: eq(candidate_applications.id, id),
    })
  ) ?? null;
};

export const getCandidateApplicationsByUserService = async (
  userId: string
): Promise<CandidateApplicationSelect[]> => {
  return db.query.candidate_applications.findMany({
    where: eq(candidate_applications.student_id, userId),
  });
};

/* ================================
   READ – Pending Applications by Approver
================================ */
export const getPendingApplicationsForApproverService = async (
  role: "school_dean" | "accounts" | "dean_of_students"
): Promise<CandidateApplicationSelect[]> => {
  if (role === "school_dean") {
    return db.query.candidate_applications.findMany({
      where: eq(candidate_applications.school_dean_status, "PENDING"),
    });
  } else if (role === "accounts") {
    return db.query.candidate_applications.findMany({
      where: eq(candidate_applications.accounts_status, "PENDING"),
    });
  } else if (role === "dean_of_students") {
    return db.query.candidate_applications.findMany({
      where: eq(candidate_applications.dean_of_students_status, "PENDING"),
    });
  }
  return [];
};


/* ================================
   UPDATE – Approve/Reject Application
================================ */
export const updateCandidateApplicationStatusService = async (
  applicationId: string,
  approverRole: "school_dean" | "accounts" | "dean_of_students",
  approverId: string,
  status: ApprovalStatusType,
  comment?: string
): Promise<CandidateApplicationSelect | null> => {
  const app = await db.query.candidate_applications.findFirst({
    where: eq(candidate_applications.id, applicationId),
  });

  if (!app) throw new Error("Application not found");

  const updateData: Partial<CandidateApplicationSelect> = {};

  if (approverRole === "school_dean") {
    updateData.school_dean_status = status;
    updateData.school_dean_id = approverId;
    if (comment) updateData.school_dean_comment = comment;
  } else if (approverRole === "accounts") {
    updateData.accounts_status = status;
    updateData.accounts_officer_id = approverId;
    if (comment) updateData.accounts_comment = comment;
  } else if (approverRole === "dean_of_students") {
    updateData.dean_of_students_status = status;
    updateData.dean_of_students_id = approverId;
    if (comment) updateData.dean_of_students_comment = comment;
  }

  await db.update(candidate_applications)
    .set(updateData)
    .where(eq(candidate_applications.id, applicationId));

  const updatedApp = (await db.query.candidate_applications.findFirst({
    where: eq(candidate_applications.id, applicationId),
  })) ?? null;

  if (!updatedApp) return null;

  // Auto-promote to candidates if all approved
  if (
    updatedApp.school_dean_status === "APPROVED" &&
    updatedApp.accounts_status === "APPROVED" &&
    updatedApp.dean_of_students_status === "APPROVED"
  ) {
    const student = await db.query.users.findFirst({ where: eq(users.id, updatedApp.student_id) });
    await db.insert(candidates).values({
      position_id: updatedApp.position_id,
      id: updatedApp.student_id,
      name: student?.name || "Unknown",
      bio: updatedApp.manifesto,
      school: updatedApp.school as SchoolType,
    });

    await db.update(candidate_applications)
      .set({ overall_status: "APPROVED" })
      .where(eq(candidate_applications.id, applicationId));
  }

  // Reject overall if any stage rejected
  if (
    updatedApp.school_dean_status === "REJECTED" ||
    updatedApp.accounts_status === "REJECTED" ||
    updatedApp.dean_of_students_status === "REJECTED"
  ) {
    await db.update(candidate_applications)
      .set({ overall_status: "REJECTED" })
      .where(eq(candidate_applications.id, applicationId));
  }

  return (
    (await db.query.candidate_applications.findFirst({
      where: eq(candidate_applications.id, applicationId),
    })) ?? null
  );
};

/* ================================
   DELETE – Remove Application
================================ */
export const deleteCandidateApplicationService = async (applicationId: string): Promise<string> => {
  const app = await db.query.candidate_applications.findFirst({
    where: eq(candidate_applications.id, applicationId),
  });

  if (!app) throw new Error("Application not found");
  if (app.overall_status !== "PENDING") throw new Error("Cannot delete processed application");

  await db.delete(candidate_applications)
    .where(eq(candidate_applications.id, applicationId));

  return "Candidate application deleted successfully";
};
