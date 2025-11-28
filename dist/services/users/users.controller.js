"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersCountBySchool = exports.getUsersCount = exports.deleteUser = exports.updateUser = exports.getUsersBySchool = exports.getUserByRegNo = exports.getUserByEmail = exports.getUserByLastName = exports.getUserById = exports.getAllUsers = void 0;
const users_service_1 = require("./users.service");
// -------------------------------
// Get all users
// -------------------------------
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, users_service_1.getAllUsersService)();
        if (users.length > 0) {
            res.status(200).json({ users });
        }
        else {
            res.status(404).json({ message: "No users found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
// -------------------------------
// Get user by ID
// -------------------------------
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, users_service_1.getUserByUserIdService)(id);
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch user" });
    }
};
exports.getUserById = getUserById;
// -------------------------------
// Get user by last name
// -------------------------------
const getUserByLastName = async (req, res) => {
    try {
        const { lastName } = req.query;
        if (typeof lastName !== "string") {
            return res.status(400).json({ error: "lastName query parameter is required" });
        }
        const users = await (0, users_service_1.getUserByLastNameService)(lastName);
        if (users.length > 0) {
            res.status(200).json({ users });
        }
        else {
            res.status(404).json({ message: "No users found with that last name" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
};
exports.getUserByLastName = getUserByLastName;
// -------------------------------
// Get user by email
// -------------------------------
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (typeof email !== "string") {
            return res.status(400).json({ error: "email query parameter is required" });
        }
        const user = await (0, users_service_1.getUserByEmailService)(email);
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch user" });
    }
};
exports.getUserByEmail = getUserByEmail;
// -------------------------------
// Get user by registration number
// -------------------------------
const getUserByRegNo = async (req, res) => {
    try {
        const { reg_no } = req.query;
        if (typeof reg_no !== "string") {
            return res.status(400).json({ error: "reg_no query parameter is required" });
        }
        const user = await (0, users_service_1.getUserByRegNoService)(reg_no);
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch user" });
    }
};
exports.getUserByRegNo = getUserByRegNo;
// -------------------------------
// Get users by school
// -------------------------------
const getUsersBySchool = async (req, res) => {
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
        ];
        if (!allowedSchools.includes(school)) {
            return res
                .status(400)
                .json({ error: `school must be one of: ${allowedSchools.join(", ")}` });
        }
        const users = await (0, users_service_1.getUsersBySchoolService)(school);
        if (users.length > 0) {
            res.status(200).json({ users });
        }
        else {
            res.status(404).json({ message: "No users found for this school" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
};
exports.getUsersBySchool = getUsersBySchool;
// -------------------------------
// Update user
// -------------------------------
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await (0, users_service_1.updateUserService)(id, updates);
        if (updatedUser) {
            res.status(200).json({ message: "User updated successfully", user: updatedUser });
        }
        else {
            res.status(404).json({ error: "User not found or update failed" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update user" });
    }
};
exports.updateUser = updateUser;
// -------------------------------
// Delete user
// -------------------------------
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await (0, users_service_1.deleteUserService)(id);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
// -------------------------------
// Get total user count
// -------------------------------
const getUsersCount = async (req, res) => {
    try {
        const count = await (0, users_service_1.getUsersCountService)();
        res.status(200).json({ count });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users count" });
    }
};
exports.getUsersCount = getUsersCount;
// -------------------------------
// Get total user count by school
// -------------------------------
const getUsersCountBySchool = async (req, res) => {
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
        ];
        if (!allowedSchools.includes(school)) {
            return res
                .status(400)
                .json({ error: `school must be one of: ${allowedSchools.join(", ")}` });
        }
        const count = await (0, users_service_1.getUsersCountBySchoolService)(school);
        res.status(200).json({ count });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users count" });
    }
};
exports.getUsersCountBySchool = getUsersCountBySchool;
