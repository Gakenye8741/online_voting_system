"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("./Auth.controller");
const bearAuth_1 = require("../middlewares/bearAuth");
const AuthRouter = (0, express_1.Router)();
// -------------------------------
// Public Routes
// -------------------------------
AuthRouter.post("/register", Auth_controller_1.registerUser); // Register new user
AuthRouter.post("/login", Auth_controller_1.loginUser); // Login (supports secret code)
// -------------------------------
// Protected Routes
// -------------------------------
// Update password using query string: ?reg_no=SC/COM/0008/22
AuthRouter.put("/update-password", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.updatePassword);
// Complete profile using query string: ?reg_no=SC/COM/0008/22
AuthRouter.put("/complete-profile", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.completeProfile);
// Set secret code (requires JWT)
AuthRouter.put("/set-secret-code", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.setSecretCode);
// Get user by registration number using query string: ?reg_no=SC/COM/0008/22
AuthRouter.get("/user/by-reg-no", bearAuth_1.anyAuthenticatedUser, Auth_controller_1.getUserByRegNo);
exports.default = AuthRouter;
