import db from "../../drizzle/db";
import { desc, ilike, sql, eq } from "drizzle-orm";
import {
  positions,
  PositionInsert,
  PositionSelect,
  School,
  positionTier,
} from "../../drizzle/schema";

// Type for school enum values
type SchoolType = typeof School.enumValues[number];
// Type for tier enum values
type TierType = typeof positionTier.enumValues[number];

// create serices
export const createPositionService = async (
  data: PositionInsert
): Promise<PositionSelect> => {
  const [newPosition] = await db.insert(positions).values(data).returning();
  return newPosition;
};

/**
 * Get all positions
 */
export const getAllPositionsService = async (): Promise<PositionSelect[]> => {
  return db.query.positions.findMany({ orderBy: [desc(positions.id)] });
};

/**
 * Get total count of positions
 */
export const getPositionsCountService = async (): Promise<number> => {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(positions);
  return Number(result.count ?? 0);
};

/**
 * Get total count of positions by school
 */
export const getPositionsCountBySchoolService = async (school: SchoolType): Promise<number> => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(positions)
    .where(eq(positions.school, school));
  return Number(result.count ?? 0);
};

/**
 * Get positions by school
 */
export const getPositionsBySchoolService = async (school: SchoolType): Promise<PositionSelect[]> => {
  return db.query.positions.findMany({
    where: eq(positions.school, school),
    orderBy: [desc(positions.name)],
  });
};

/**
 * Get positions by tier
 */
export const getPositionsByTierService = async (tier: TierType): Promise<PositionSelect[]> => {
  return db.query.positions.findMany({
    where: eq(positions.tier, tier),
    orderBy: [desc(positions.name)],
  });
};

/**
 * Get a single position by ID
 */
export const getPositionByIdService = async (id: string): Promise<PositionSelect | undefined> => {
  return db.query.positions.findFirst({ where: eq(positions.id, id) });
};

/**
 * Search positions by name (partial match)
 */
export const getPositionsByNameService = async (name: string): Promise<PositionSelect[]> => {
  return db.query.positions.findMany({
    where: ilike(positions.name, `%${name}%`),
  });
};

/**
 * Get positions by election ID
 */
export const getPositionsByElectionIdService = async (electionId: string): Promise<PositionSelect[]> => {
  return db.query.positions.findMany({
    where: eq(positions.election_id, electionId),
    orderBy: [desc(positions.name)],
  });
};

/**
 * Update a position
 */
export const updatePositionService = async (
  id: string,
  updates: Partial<PositionInsert>
): Promise<PositionSelect | null> => {
  const [updatedPosition] = await db
    .update(positions)
    .set(updates)
    .where(eq(positions.id, id))
    .returning();

  return updatedPosition ?? null;
};

/**
 * Delete a position
 */
export const deletePositionService = async (id: string): Promise<string> => {
  await db.delete(positions).where(eq(positions.id, id));
  return "Position deleted successfully";
};
