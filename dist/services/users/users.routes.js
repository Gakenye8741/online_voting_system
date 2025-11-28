"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const bearAuth_1 = require("../../middlewares/bearAuth");
const UsersRouter = (0, express_1.Router)();
// -------------------------------
// Public Routes
// -------------------------------
// Get all users
UsersRouter.get("/", bearAuth_1.adminAuth, users_controller_1.getAllUsers);
// Get user by ID
UsersRouter.get("/by-id/:id", bearAuth_1.adminAuth, users_controller_1.getUserById);
// Get user by last name (query param: ?lastName=Smith)
UsersRouter.get("/by-last-name", bearAuth_1.adminAuth, users_controller_1.getUserByLastName);
// Get user by email (query param: ?email=test@example.com)
UsersRouter.get("/by-email", bearAuth_1.adminAuth, users_controller_1.getUserByEmail);
// Get user by registration number (query param: ?reg_no=sc/com/0008/22)
UsersRouter.get("/by-reg-no", bearAuth_1.adminAuth, users_controller_1.getUserByRegNo);
// Get users by school (query param: ?school=Science)
UsersRouter.get("/by-school", bearAuth_1.anyAuthenticatedUser, users_controller_1.getUsersBySchool);
// -------------------------------
// Counts
// -------------------------------
// Get total users count
UsersRouter.get("/count", bearAuth_1.anyAuthenticatedUser, users_controller_1.getUsersCount);
// Get total users count by school (query param: ?school=Science)
UsersRouter.get("/count-by-school", bearAuth_1.anyAuthenticatedUser, users_controller_1.getUsersCountBySchool);
// -------------------------------
// Protected Routes
// -------------------------------
// Update user by ID
UsersRouter.put("/update/:id", bearAuth_1.anyAuthenticatedUser, users_controller_1.updateUser);
// Delete user by ID
UsersRouter.delete("/delete/:id", bearAuth_1.anyAuthenticatedUser, users_controller_1.deleteUser);
exports.default = UsersRouter;
