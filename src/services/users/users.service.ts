import db from "../../drizzle/db";
import { desc, ilike, sql } from "drizzle-orm";
import { users, UserInsert, UserSelect, School } from "../../drizzle/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

// Helper to remove password from returned user objects
function excludePassword<T extends { password?: string }>(user: T): Omit<T, "password"> {
  const { password, ...rest } = user;
  return rest;
}

// Type for school enum values
type SchoolType = typeof School.enumValues[number];

/**
 * Get all users (without passwords)
 */
export const getAllUsersService = async (): Promise<Omit<UserSelect, "password">[]> => {
  const userList = await db.query.users.findMany({ orderBy: [desc(users.id)] });
  return userList.map(excludePassword);
};

/**
 * Get total count of users
 */
export const getUsersCountService = async (): Promise<number> => {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
  return Number(result.count ?? 0);
};

/**
 * Get total count of users by school
 */
export const getUsersCountBySchoolService = async (school: SchoolType): Promise<number> => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.school, school));
  return Number(result.count ?? 0);
};

/**
 * Get users by school
 */
export const getUsersBySchoolService = async (school: SchoolType): Promise<Omit<UserSelect, "password">[]> => {
  const userList = await db.query.users.findMany({
    where: eq(users.school, school),
    orderBy: [desc(users.reg_no)],
  });
  return userList.map(excludePassword);
};

/**
 * Get a single user by ID
 */
export const getUserByUserIdService = async (id: string): Promise<Omit<UserSelect, "password"> | undefined> => {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  return user ? excludePassword(user) : undefined;
};

/**
 * Search users by last name (partial match)
 */
export const getUserByLastNameService = async (lastName: string): Promise<Omit<UserSelect, "password">[]> => {
  const results = await db.query.users.findMany({
    where: ilike(users.name, `%${lastName}%`),
  });
  return results.map(excludePassword);
};

/**
 * Get user by email
 */
export const getUserByEmailService = async (email: string): Promise<UserSelect | undefined> => {
  return db.query.users.findFirst({ where: eq(users.email, email) });
};

/**
 * Get user by registration number
 */
export const getUserByRegNoService = async (regNo: string): Promise<UserSelect | undefined> => {
  return db.query.users.findFirst({ where: eq(users.reg_no, regNo) });
};

/**
 * Update a user (password is hashed if present)
 */
export const updateUserService = async (
  id: string,
  updates: Partial<UserInsert>
): Promise<Omit<UserSelect, "password"> | null> => {
  if (updates.password) {
    const salt = bcrypt.genSaltSync(10);
    updates.password = bcrypt.hashSync(updates.password, salt);
  }

  const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
  return updatedUser ? excludePassword(updatedUser) : null;
};

/**
 * Delete a user
 */
export const deleteUserService = async (id: string): Promise<string> => {
  await db.delete(users).where(eq(users.id, id));
  return "User deleted successfully";
};

/**
 * Check if user is eligible to vote
 */
export const checkUserEligibilityService = (user: UserSelect): boolean => {
  return user.graduation_status === "active" && user.has_secret_code && user.has_face_verification;
};
