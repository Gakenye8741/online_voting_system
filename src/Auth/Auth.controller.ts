import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerUserService,
  loginUserService,
  completeStudentProfileService,
  updateUserPasswordService,
  getUserByRegNoService,
} from "./Auth.service";
import {
  registerUserValidator,
  loginUserValidator,
  completeProfileValidator,
  updatePasswordValidator,
} from "../validators/Auth.validator";

// -------------------------------
// Register a new student
// -------------------------------
export const registerUser: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const parseResult = registerUserValidator.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }

    const { reg_no, password, role } = parseResult.data;

    // Check if user already exists
    const existingUser = await getUserByRegNoService(reg_no);
    if (existingUser) {
      return res.status(400).json({ error: "User with this registration number already exists" });
    }

    // Hash password (use reg_no if password not provided)
    const hashedPassword = bcrypt.hashSync(password || reg_no, 10);

    // Register user; role will default to "voter" if not provided
    const newUser = await registerUserService(reg_no, hashedPassword, role);

    res.status(201).json({
      message: "User registered successfully. Use reg_no + password to login.",
      user: newUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to register user" });
  }
};

// -------------------------------
// Login student
// -------------------------------
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const parseResult = loginUserValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const { reg_no, password } = parseResult.data;

    const user = await loginUserService(reg_no, password);
    if (!user) return res.status(401).json({ error: "Invalid registration number or password" });

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid registration number or password" });

    // Generate JWT
    const payload = { reg_no: user.reg_no, name: user.name, id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "24h" });

    res.status(200).json({ message: "Login successful", token, user: payload });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to login student" });
  }
};

// -------------------------------
// Complete profile after first login
// -------------------------------
export const completeProfile: RequestHandler = async (req, res) => {
  try {
    const parseResult = completeProfileValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const { reg_no } = req.params; // or from token
    const { name, school, expected_graduation } = parseResult.data;

    const updatedUser = await completeStudentProfileService(
      reg_no,
      name,
      school,
      expected_graduation,
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
};

// -------------------------------
// Update password
// -------------------------------
export const updatePassword: RequestHandler = async (req, res) => {
  try {
    const parseResult = updatePasswordValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const { reg_no } = req.params; // or from token
    const { password } = parseResult.data;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const message = await updateUserPasswordService(reg_no, hashedPassword);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update password" });
  }
};
