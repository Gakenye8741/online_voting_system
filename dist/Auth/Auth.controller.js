"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByRegNo = exports.completeProfile = exports.updatePassword = exports.setSecretCode = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Auth_service_1 = require("./Auth.service");
const Auth_validator_1 = require("../validators/Auth.validator");
// -------------------------------
// Register
// -------------------------------
const registerUser = async (req, res) => {
    try {
        const parseResult = Auth_validator_1.registerUserValidator.safeParse(req.body);
        if (!parseResult.success)
            return res.status(400).json({ error: parseResult.error.issues });
        const { reg_no, password, role } = parseResult.data;
        const existingUser = await (0, Auth_service_1.getUserByRegNoService)(reg_no);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Auto password = reg_no if password is missing
        const hashedPassword = bcrypt_1.default.hashSync(password || reg_no, 10);
        const newUser = await (0, Auth_service_1.registerUserService)(reg_no, hashedPassword, role);
        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.registerUser = registerUser;
// -------------------------------
// Login student (supports secret code and first-login secret code enforcement)
// -------------------------------
// -------------------------------
// Login student (supports first login & secret code)
// -------------------------------
const loginUser = async (req, res) => {
    try {
        const parseResult = Auth_validator_1.loginUserValidator.safeParse(req.body);
        if (!parseResult.success)
            return res.status(400).json({ error: parseResult.error.issues });
        const { reg_no, password, secret_code } = parseResult.data;
        const user = await (0, Auth_service_1.loginUserService)(reg_no, password, secret_code);
        // Create JWT token for client
        const payload = {
            reg_no: user.reg_no,
            name: user.name,
            id: user.id,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
        // Check if secret code is set
        if (!user.has_secret_code) {
            return res.status(200).json({
                message: "First login detected. You must set a secret code.",
                token, // <-- JWT token included
                user: payload,
                requireSecretCode: true,
            });
        }
        // Secret code exists, but client might not have provided it
        if (user.has_secret_code && !secret_code) {
            return res.status(200).json({
                message: "Secret code required for login.",
                token: null,
                user: payload,
                requireSecretCode: true,
            });
        }
        // Secret code provided and valid, full login successful
        res.status(200).json({
            message: "Login successful",
            token,
            user: payload,
        });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.loginUser = loginUser;
// -------------------------------
// Set secret code (requires JWT)
// -------------------------------
const setSecretCode = async (req, res) => {
    try {
        const { secret_code } = req.body;
        if (!secret_code) {
            return res.status(400).json({ error: "secret_code is required" });
        }
        const reg_no = req.user.reg_no; // comes from JWT middleware
        const msg = await (0, Auth_service_1.createSecretCodeService)(reg_no, secret_code);
        res.status(200).json({ message: msg });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.setSecretCode = setSecretCode;
// -------------------------------
// Update password
// -------------------------------
const updatePassword = async (req, res) => {
    const parseResult = Auth_validator_1.updatePasswordValidator.safeParse(req.body);
    if (!parseResult.success)
        return res.status(400).json({ error: parseResult.error.issues });
    const reg_no = req.query.reg_no;
    if (!reg_no)
        return res.status(400).json({ error: "reg_no is required" });
    const { password } = parseResult.data;
    // DON'T hash here, service handles it
    const message = await (0, Auth_service_1.updateUserPasswordService)(reg_no, password);
    res.status(200).json({ message });
};
exports.updatePassword = updatePassword;
// -------------------------------
// Complete profile
// -------------------------------
const completeProfile = async (req, res) => {
    try {
        const parseResult = Auth_validator_1.completeProfileValidator.safeParse(req.body);
        if (!parseResult.success)
            return res.status(400).json({ error: parseResult.error.issues });
        const reg_no = req.query.reg_no;
        if (!reg_no)
            return res.status(400).json({ error: "reg_no is required" });
        const { name, school, expected_graduation, email } = parseResult.data;
        const updatedUser = await (0, Auth_service_1.completeStudentProfileService)(reg_no, name, school, expected_graduation, email);
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.completeProfile = completeProfile;
// -------------------------------
// Get user by registration number
// -------------------------------
const getUserByRegNo = async (req, res) => {
    try {
        const reg_no = req.query.reg_no;
        if (!reg_no)
            return res.status(400).json({ error: "reg_no is required" });
        const user = await (0, Auth_service_1.getUserByRegNoService)(reg_no);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserByRegNo = getUserByRegNo;
