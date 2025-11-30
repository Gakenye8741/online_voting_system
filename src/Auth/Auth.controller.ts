import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerUserService,
  loginUserService,
  completeStudentProfileService,
  updateUserPasswordService,
  getUserByRegNoService,
  createSecretCodeService,
} from "./Auth.service";

import {
  registerUserValidator,
  loginUserValidator,
  completeProfileValidator,
  updatePasswordValidator,
} from "../validators/Auth.validator";

// -------------------------------
// Register a new user
// -------------------------------
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const parseResult = registerUserValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const { reg_no, password, role } = parseResult.data;

    const existingUser = await getUserByRegNoService(reg_no);
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password || reg_no, 10);

    const newUser = await registerUserService(reg_no, hashedPassword, role);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------
// Login user
// -------------------------------
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const parseResult = loginUserValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const { reg_no, password } = parseResult.data;

    const user = await loginUserService(reg_no, password);

    const payload = {
      id: user.id,
      reg_no: user.reg_no,
      name: user.name,
      role: user.role,
      school: user.school,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "24h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
      requireSecretCode: !user.has_secret_code,
      requireProfileCompletion: !user.profile_complete,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// -------------------------------
// Complete profile
// -------------------------------
export const completeProfile: RequestHandler = async (req, res) => {
  try {
    const parseResult = completeProfileValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const reg_no = req.query.reg_no as string;
    if (!reg_no) return res.status(400).json({ error: "reg_no is required" });

    const { name, school, expected_graduation, email } = parseResult.data;

    const updatedUser = await completeStudentProfileService(
      reg_no,
      name,
      school,
      expected_graduation,
      email
    );

    res.status(200).json({
      message: "Profile completed successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------
// Set secret code
// -------------------------------
export const setSecretCode: RequestHandler = async (req, res) => {
  try {
    const { secret_code } = req.body;
    if (!secret_code) return res.status(400).json({ error: "secret_code is required" });

    const reg_no = (req as any).user.reg_no; // from JWT middleware
    const msg = await createSecretCodeService(reg_no, secret_code);

    res.status(200).json({ message: msg });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------------------
// Update password
// -------------------------------
export const updatePassword: RequestHandler = async (req, res) => {
  try {
    const parseResult = updatePasswordValidator.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json({ error: parseResult.error.issues });

    const reg_no = req.query.reg_no as string;
    if (!reg_no) return res.status(400).json({ error: "reg_no is required" });

    const { password } = parseResult.data;
    const message = await updateUserPasswordService(reg_no, password);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------
// Get user by registration number
// -------------------------------
export const getUserByRegNo: RequestHandler = async (req, res) => {
  try {
    const reg_no = req.query.reg_no as string;
    if (!reg_no) return res.status(400).json({ error: "reg_no is required" });

    const user = await getUserByRegNoService(reg_no);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
