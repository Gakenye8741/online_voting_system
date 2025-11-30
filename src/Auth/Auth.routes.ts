import { Router } from "express";
import {
  registerUser,
  loginUser,
  completeProfile,
  updatePassword,
  setSecretCode,
  getUserByRegNo,
} from "./Auth.controller";
import { anyAuthenticatedUser } from "../middlewares/bearAuth";

const AuthRouter = Router();

// -------------------------------
// Public Routes
// -------------------------------

// Register a new user
AuthRouter.post("/register", registerUser);

// Login (supports first login & secret code / profile completion checks)
AuthRouter.post("/login", loginUser);

// -------------------------------
// Protected Routes (require JWT auth)
// -------------------------------

// Update password: ?reg_no=SC/COM/0008/22
AuthRouter.put("/update-password", anyAuthenticatedUser, updatePassword);

// Complete profile: ?reg_no=SC/COM/0008/22
AuthRouter.put("/complete-profile", anyAuthenticatedUser, completeProfile);

// Set secret code (first login only)
AuthRouter.put("/set-secret-code", anyAuthenticatedUser, setSecretCode);

// Get user by registration number: ?reg_no=SC/COM/0008/22
AuthRouter.get("/user/by-reg-no", anyAuthenticatedUser, getUserByRegNo);

export default AuthRouter;
