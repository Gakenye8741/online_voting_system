import { Router } from "express";
import {
  registerUser,
  loginUser,
  completeProfile,
  updatePassword,
  setSecretCode,
  getUserByRegNo, // new route
} from "./Auth.controller";
import { anyAuthenticatedUser } from "../middlewares/bearAuth";

const AuthRouter = Router();

// -------------------------------
// Public Routes
// -------------------------------
AuthRouter.post("/register", registerUser);        // Register new user
AuthRouter.post("/login", loginUser);              // Login (supports secret code)

// -------------------------------
// Protected Routes
// -------------------------------

// Update password using query string: ?reg_no=SC/COM/0008/22
AuthRouter.put("/update-password", anyAuthenticatedUser, updatePassword);

// Complete profile using query string: ?reg_no=SC/COM/0008/22
AuthRouter.put("/complete-profile", anyAuthenticatedUser, completeProfile);

// Set secret code (requires JWT)
AuthRouter.put("/set-secret-code", anyAuthenticatedUser, setSecretCode);

// Get user by registration number using query string: ?reg_no=SC/COM/0008/22
AuthRouter.get("/user/by-reg-no", anyAuthenticatedUser, getUserByRegNo);

export default AuthRouter;
