import { Request, Response, RequestHandler } from "express";
import {
  getAllUsersService,
  getUserByUserIdService,
  getUserByLastNameService,
  getUserByEmailService,
  getUserByRegNoService,
  getUsersBySchoolService,
  getUsersCountService,
  getUsersCountBySchoolService,
  updateUserService,
  deleteUserService,
} from "./users.service";
import { UserSelect } from "../../drizzle/schema";

// -------------------------------
// Get all users
// -------------------------------
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users: Omit<UserSelect, "password">[] = await getAllUsersService();
    if (users.length > 0) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
};

// -------------------------------
// Get user by ID
// -------------------------------
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user: Omit<UserSelect, "password"> | undefined = await getUserByUserIdService(id);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

// -------------------------------
// Get user by last name
// -------------------------------
export const getUserByLastName: RequestHandler = async (req, res) => {
  try {
    const { lastName } = req.query;
    if (typeof lastName !== "string") {
      return res.status(400).json({ error: "lastName query parameter is required" });
    }

    const users: Omit<UserSelect, "password">[] = await getUserByLastNameService(lastName);

    if (users.length > 0) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ message: "No users found with that last name" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
};

// -------------------------------
// Get user by email
// -------------------------------
export const getUserByEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.query;
    if (typeof email !== "string") {
      return res.status(400).json({ error: "email query parameter is required" });
    }

    const user: Omit<UserSelect, "password"> | undefined = await getUserByEmailService(email);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

// -------------------------------
// Get user by registration number
// -------------------------------
export const getUserByRegNo: RequestHandler = async (req, res) => {
  try {
    const { reg_no } = req.query;
    if (typeof reg_no !== "string") {
      return res.status(400).json({ error: "reg_no query parameter is required" });
    }

    const user: Omit<UserSelect, "password"> | undefined = await getUserByRegNoService(reg_no);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

// -------------------------------
// Get users by school
// -------------------------------
export const getUsersBySchool: RequestHandler = async (req, res) => {
  try {
    const { school } = req.query;
    if (typeof school !== "string") {
      return res.status(400).json({ error: "school query parameter is required" });
    }

    const allowedSchools = [
      "Science",
      "Education",
      "Business",
      "Humanities and Developmental_Studies",
      "TVET",
    ] as const;
    type School = typeof allowedSchools[number];

    if (!allowedSchools.includes(school as School)) {
      return res
        .status(400)
        .json({ error: `school must be one of: ${allowedSchools.join(", ")}` });
    }

    const users: Omit<UserSelect, "password">[] = await getUsersBySchoolService(
      school as School
    );

    if (users.length > 0) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ message: "No users found for this school" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
};

// -------------------------------
// Update user
// -------------------------------
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates: Partial<Omit<UserSelect, "password">> = req.body;

    const updatedUser: Omit<UserSelect, "password"> | null = await updateUserService(id, updates);

    if (updatedUser) {
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ error: "User not found or update failed" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
};

// -------------------------------
// Delete user
// -------------------------------
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const message: string = await deleteUserService(id);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
};

// -------------------------------
// Get total user count
// -------------------------------
export const getUsersCount: RequestHandler = async (req, res) => {
  try {
    const count: number = await getUsersCountService();
    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users count" });
  }
};

// -------------------------------
// Get total user count by school
// -------------------------------
export const getUsersCountBySchool: RequestHandler = async (req, res) => {
  try {
    const { school } = req.query;
    if (typeof school !== "string") {
      return res.status(400).json({ error: "school query parameter is required" });
    }

    const allowedSchools = [
      "Science",
      "Education",
      "Business",
      "Humanities and Developmental_Studies",
      "TVET",
    ] as const;
    type School = typeof allowedSchools[number];

    if (!allowedSchools.includes(school as School)) {
      return res
        .status(400)
        .json({ error: `school must be one of: ${allowedSchools.join(", ")}` });
    }

    const count: number = await getUsersCountBySchoolService(school as School);
    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users count" });
  }
};
