import db from "../../drizzle/db";
import { desc, ilike, sql, eq } from "drizzle-orm";
import {
  candidates,
  CandidateInsert,
  CandidateSelect,
  School,
} from "../../drizzle/schema";

// Type for school enum values
type SchoolType = typeof School.enumValues[number];

/**
 * Create a candidate
 */
export const createCandidateService = async (
  data: CandidateInsert
): Promise<CandidateSelect> => {
  const [newCandidate] = await db.insert(candidates).values(data).returning();
  return newCandidate;
};

/**
 * Get all candidates
 */
export const getAllCandidatesService = async (): Promise<CandidateSelect[]> => {
  return db.query.candidates.findMany({
    orderBy: [desc(candidates.name)],
  });
};

/**
 * Get total count of candidates
 */
export const getCandidatesCountService = async (): Promise<number> => {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(candidates);
  return Number(result.count ?? 0);
};

/**
 * Get total count of candidates by school
 */
export const getCandidatesCountBySchoolService = async (
  school: SchoolType
): Promise<number> => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(candidates)
    .where(eq(candidates.school, school));

  return Number(result.count ?? 0);
};

/**
 * Get candidates by school
 */
export const getCandidatesBySchoolService = async (
  school: SchoolType
): Promise<CandidateSelect[]> => {
  return db.query.candidates.findMany({
    where: eq(candidates.school, school),
    orderBy: [desc(candidates.name)],
  });
};

/**
 * Get candidates by position ID
 */
export const getCandidatesByPositionService = async (
  positionId: string
): Promise<CandidateSelect[]> => {
  return db.query.candidates.findMany({
    where: eq(candidates.position_id, positionId),
    orderBy: [desc(candidates.name)],
  });
};

/**
 * Get candidates by coalition ID
 */
export const getCandidatesByCoalitionService = async (
  coalitionId: string
): Promise<CandidateSelect[]> => {
  return db.query.candidates.findMany({
    where: eq(candidates.coalition_id, coalitionId),
    orderBy: [desc(candidates.name)],
  });
};

/**
 * Get a single candidate by ID
 */
export const getCandidateByIdService = async (
  id: string
): Promise<CandidateSelect | undefined> => {
  return db.query.candidates.findFirst({
    where: eq(candidates.id, id),
  });
};

/**
 * Search candidates by name (partial match)
 */
export const getCandidatesByNameService = async (
  name: string
): Promise<CandidateSelect[]> => {
  return db.query.candidates.findMany({
    where: ilike(candidates.name, `%${name}%`),
  });
};

/**
 * Update a candidate
 */
export const updateCandidateService = async (
  id: string,
  updates: Partial<CandidateInsert>
): Promise<CandidateSelect | null> => {
  const [updatedCandidate] = await db
    .update(candidates)
    .set(updates)
    .where(eq(candidates.id, id))
    .returning();

  return updatedCandidate ?? null;
};

/**
 * Delete a candidate
 */
export const deleteCandidateService = async (id: string): Promise<string> => {
  await db.delete(candidates).where(eq(candidates.id, id));
  return "Candidate deleted successfully";
};
