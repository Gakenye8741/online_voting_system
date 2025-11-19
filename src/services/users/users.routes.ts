import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getUserByLastName,
  getUserByEmail,
  getUserByRegNo,
  getUsersBySchool,
  getUsersCount,
  getUsersCountBySchool,
  updateUser,
  deleteUser,
} from "./users.controller";
import { adminAuth, anyAuthenticatedUser } from "../../middlewares/bearAuth";


const UsersRouter = Router();

// -------------------------------
// Public Routes
// -------------------------------

// Get all users
UsersRouter.get("/", adminAuth, getAllUsers);

// Get user by ID
UsersRouter.get("/by-id/:id", adminAuth, getUserById);

// Get user by last name (query param: ?lastName=Smith)
UsersRouter.get("/by-last-name", adminAuth, getUserByLastName);

// Get user by email (query param: ?email=test@example.com)
UsersRouter.get("/by-email", adminAuth, getUserByEmail);

// Get user by registration number (query param: ?reg_no=sc/com/0008/22)
UsersRouter.get("/by-reg-no", adminAuth, getUserByRegNo);

// Get users by school (query param: ?school=Science)
UsersRouter.get("/by-school", anyAuthenticatedUser, getUsersBySchool);

// -------------------------------
// Counts
// -------------------------------

// Get total users count
UsersRouter.get("/count", anyAuthenticatedUser, getUsersCount);

// Get total users count by school (query param: ?school=Science)
UsersRouter.get("/count-by-school", anyAuthenticatedUser, getUsersCountBySchool);

// -------------------------------
// Protected Routes
// -------------------------------

// Update user by ID
UsersRouter.put("/update/:id", anyAuthenticatedUser, updateUser);

// Delete user by ID
UsersRouter.delete("/delete/:id", anyAuthenticatedUser, deleteUser);

export default UsersRouter;
