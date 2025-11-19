import { desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { elections, ElectionInsert, ElectionSelect, electionStatus } from "../../drizzle/schema";

// Type helper for election status
type ElectionStatus = typeof electionStatus.enumValues[number];

// -------------------------------
// Create a new election
// -------------------------------
export const createElectionService = async (
  electionData: ElectionInsert
): Promise<ElectionSelect> => {
  const [newElection] = await db.insert(elections)
    .values(electionData)
    .returning();

  if (!newElection) throw new Error("Failed to create election");
  return newElection;
};

// -------------------------------
// Get all elections
// -------------------------------
export const getAllElectionsService = async (): Promise<ElectionSelect[]> => {
  return db.query.elections.findMany({
    orderBy: [desc(elections.start_date)],
  });
};

// -------------------------------
// Get election by ID
// -------------------------------
export const getElectionByIdService = async (
  id: string
): Promise<ElectionSelect | undefined> => {
  return db.query.elections.findFirst({ where: eq(elections.id, id) });
};

// -------------------------------
// Update an election
// -------------------------------
export const updateElectionService = async (
  id: string,
  updates: Partial<ElectionInsert>
): Promise<ElectionSelect | null> => {
  const [updatedElection] = await db.update(elections)
    .set(updates)
    .where(eq(elections.id, id))
    .returning();

  return updatedElection ?? null;
};

// -------------------------------
// Delete an election
// -------------------------------
export const deleteElectionService = async (id: string): Promise<string> => {
  await db.delete(elections).where(eq(elections.id, id));
  return "Election deleted successfully";
};

// -------------------------------
// Change election status explicitly
// -------------------------------
export const changeElectionStatusService = async (
  id: string,
  status: ElectionStatus
): Promise<ElectionSelect | null> => {
  const [updatedElection] = await db.update(elections)
    .set({ status })
    .where(eq(elections.id, id))
    .returning();

  return updatedElection ?? null;
};

// -------------------------------
// Get elections by status
// -------------------------------
export const getElectionsByStatusService = async (
  status: ElectionStatus
): Promise<ElectionSelect[]> => {
  return db.query.elections.findMany({ where: eq(elections.status, status) });
};

 // -------------------------------
 // Auto-update all elections based on current date
 // -------------------------------
 export const autoUpdateElectionStatusService = async (): Promise<void> => {
   const now = new Date();
   const allElections = await db.query.elections.findMany();

   for (const election of allElections) {
     let newStatus: ElectionStatus | null = election.status;

     if (now < new Date(election.start_date)) {
       newStatus = "upcoming";
     } else if (now >= new Date(election.start_date) && now <= new Date(election.end_date)) {
       newStatus = "ongoing";
     } else if (now > new Date(election.end_date)) {
       newStatus = "finished";
     }

     if (newStatus !== election.status) {
       await db.update(elections)
         .set({ status: newStatus })
         .where(eq(elections.id, election.id));
     }
   }
 };
