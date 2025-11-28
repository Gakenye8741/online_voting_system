import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { userRole, users, UserSelect } from "../drizzle/schema";
import bcrypt from "bcrypt";

// ================================
// Register a new student (minimal)
// ================================
export const registerUserService = async (
  reg_no: string,
  password: string,
  role?: typeof userRole.enumValues[number]
): Promise<UserSelect> => {
  const newRole = role || "voter";

  const [newUser] = await db.insert(users)
    .values({
      reg_no,
      password,
      role: newRole,
      graduation_status: "active",
      has_secret_code: false,
      has_face_verification: false,
      name: reg_no,
      expected_graduation: "01/2099",
    })
    .returning();

  if (!newUser) throw new Error("Failed to create user");

  return newUser;
};

// ================================
// Login service (first-login allows secret code creation)
// ================================
export const loginUserService = async (
  reg_no: string,
  password: string
): Promise<UserSelect> => {
  const user = await db.query.users.findFirst({
    where: eq(users.reg_no, reg_no),
  });

  if (!user) throw new Error("User not found");

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid password");

  // If secret code exists, enforce it later when voting (not here)
  // First login: allow without secret code

  return user;
};

// ================================
// Create secret code
// ================================
export const createSecretCodeService = async (
  reg_no: string,
  secret_code: string
): Promise<string> => {
  const hashedCode = await bcrypt.hash(secret_code, 10);

  const [updated] = await db.update(users)
    .set({
      secret_code_hash: hashedCode,
      has_secret_code: true
    })
    .where(eq(users.reg_no, reg_no))
    .returning();

  if (!updated) throw new Error("Failed to set secret code");

  return "Secret code created successfully";
};

// ================================
// Complete profile
// ================================
export const completeStudentProfileService = async (
  reg_no: string,
  name: string,
  school: "Science" | "Education" | "Business" | "Humanities and Developmental_Studies" | "TVET",
  expected_graduation: string,
  email: string
): Promise<UserSelect> => {
  const [updatedUser] = await db.update(users)
    .set({
      name,
      school,
      expected_graduation,
      email,
    })
    .where(eq(users.reg_no, reg_no))
    .returning();

  if (!updatedUser) throw new Error("Failed to update profile");

  return updatedUser;
};

// ================================
// Get user by reg no
// ================================
export const getUserByRegNoService = async (
  reg_no: string
): Promise<UserSelect | undefined> => {
  return db.query.users.findFirst({
    where: eq(users.reg_no, reg_no),
  });
};

// ================================
// Update password
// ================================
export const updateUserPasswordService = async (
  reg_no: string,
  newPassword: string
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [updated] = await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.reg_no, reg_no))
    .returning();

  if (!updated) throw new Error("User not found or password update failed");

  return "Password updated successfully";
};
