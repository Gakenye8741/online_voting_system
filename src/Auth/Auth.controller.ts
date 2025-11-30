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
// Register
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
// Login
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

    // Flags
    const requireSecretCode = !user.has_secret_code;
    const requireProfileCompletion = !user.profile_complete;

    res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
      requireSecretCode,
      requireProfileCompletion,
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
