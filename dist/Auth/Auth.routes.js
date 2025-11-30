"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("./Auth.controller");
const bearAuth_1 = require("../middlewares/bearAuth");
const AuthRouter = (0, express_1.Router)();
// -------------------------------
// Public Routes
// -------------------------------
// Register a new user
AuthRouter.post("/register", Auth_controller_1.registerUser);
// Login (supports first login & secret code / profile completion checks)
AuthRouter.post("/login", Auth_controller_1.loginUser);
// -------------------------------
// Protected Routes (require JWT auth)
// -------------------------------
// Update password: ?reg_no=SC/COM/0008/22
AuthRouter.put("/update-password", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.updatePassword);
// Complete profile: ?reg_no=SC/COM/0008/22
AuthRouter.put("/complete-profile", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.completeProfile);
// Set secret code (first login only)
AuthRouter.put("/set-secret-code", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.setSecretCode);
// Get user by registration number: ?reg_no=SC/COM/0008/22
AuthRouter.get("/user/by-reg-no", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.getUserByRegNo);
exports.default = AuthRouter;
