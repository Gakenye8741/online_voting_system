import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { userRole, users, UserSelect} from "../drizzle/schema";

// ================================
// Register a new student (minimal)
// ================================
export const registerUserService = async (
  reg_no: string,
  password: string, // already hashed in controller
  role?: typeof userRole.enumValues[number] // optional role
): Promise<UserSelect> => {
  const newRole = role || "voter"; // default to voter if role is not provided

  const [newUser] = await db.insert(users)
    .values({
      reg_no,
      password,
      role: newRole,
      graduation_status: "active",
      has_secret_code: false,
      has_face_verification: false,
      name: reg_no, // temporary placeholder
      expected_graduation: "01/2099", // temporary placeholder
    })
    .returning();

  if (!newUser) throw new Error("Failed to create user");

  return newUser;
};

// ================================
// Login service (reg_no + password)
// ================================
export const loginUserService = async (
  reg_no: string,
  password: string
): Promise<UserSelect| null> => {
  const user = await db.query.users.findFirst({
    where: eq(users.reg_no, reg_no),
  });

  if (!user) return null;

  return user;
};

// ================================
// Complete profile after first login
// ================================
export const completeStudentProfileService = async (
  reg_no: string,
  name: string,
  school: "Science" | "Education" | "Business" | "Humanities and Developmental_Studies" | "TVET",
  expected_graduation: string,
): Promise<UserSelect> => {
  const [updatedUser] = await db.update(users)
    .set({
      name,
      school,
      expected_graduation,
    })
    .where(eq(users.reg_no, reg_no))
    .returning();

  if (!updatedUser) throw new Error("Failed to update profile");

  return updatedUser;
};

// ================================
// Get user by registration number
// ================================
export const getUserByRegNoService = async (
  reg_no: string
): Promise<UserSelect| undefined> => {
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
  const [updated] = await db.update(users)
    .set({ password: newPassword })
    .where(eq(users.reg_no, reg_no))
    .returning();

  if (!updated) throw new Error("User not found or password update failed");
  return "Password updated successfully";
};
