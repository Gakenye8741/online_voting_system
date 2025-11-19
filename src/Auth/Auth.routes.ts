import { Router } from "express";
import {
  registerUser,
  loginUser,
  completeProfile,
  updatePassword,
} from "./Auth.controller";
import { anyAuthenticatedUser } from "../middlewares/bearAuth";

const AuthRouter = Router();

// -------------------------------
// Public Routes
// -------------------------------
AuthRouter.post("/register", registerUser);       // Register a new student
AuthRouter.post("/login", loginUser);             // Login using reg_no + password
AuthRouter.put("/update-password/:reg_no", updatePassword); // Update password

// -------------------------------
// Protected Routes (JWT required)
// -------------------------------
AuthRouter.put("/complete-profile/:reg_no", anyAuthenticatedUser, completeProfile); // Complete profile after first login

export default AuthRouter;
