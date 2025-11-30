"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPasswordService = exports.getUserByRegNoService = exports.createSecretCodeService = exports.completeStudentProfileService = exports.loginUserService = exports.registerUserService = void 0;
const db_1 = __importDefault(require("../drizzle/db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
// ================================
// Register a new student
// ================================
const registerUserService = async (reg_no, password, role) => {
    const newRole = role || "voter";
    const [newUser] = await db_1.default.insert(schema_1.users)
        .values({
        reg_no,
        password,
        role: newRole,
        graduation_status: "active",
        has_secret_code: false,
        has_face_verification: false,
        profile_complete: false, // incomplete by default
        name: reg_no,
        expected_graduation: "01/2099",
        school: null, // null until profile completion
    })
        .returning();
    if (!newUser)
        throw new Error("Failed to create user");
    return newUser;
};
exports.registerUserService = registerUserService;
// ================================
// Login service
// ================================
const loginUserService = async (reg_no, password) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.reg_no, reg_no),
    });
    if (!user)
        throw new Error("User not found");
    const validPassword = await bcrypt_1.default.compare(password, user.password);
    if (!validPassword)
        throw new Error("Invalid password");
    return user; // return DB record directly
};
exports.loginUserService = loginUserService;
// ================================
// Complete profile
// ================================
const completeStudentProfileService = async (reg_no, name, school, expected_graduation, email) => {
    const [updatedUser] = await db_1.default.update(schema_1.users)
        .set({
        name,
        school,
        expected_graduation,
        email,
        profile_complete: true,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.reg_no, reg_no))
        .returning();
    if (!updatedUser)
        throw new Error("Failed to update profile");
    return updatedUser;
};
exports.completeStudentProfileService = completeStudentProfileService;
// ================================
// Create secret code
// ================================
const createSecretCodeService = async (reg_no, secret_code) => {
    const hashedCode = await bcrypt_1.default.hash(secret_code, 10);
    const [updated] = await db_1.default.update(schema_1.users)
        .set({
        secret_code_hash: hashedCode,
        has_secret_code: true
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.reg_no, reg_no))
        .returning();
    if (!updated)
        throw new Error("Failed to set secret code");
    return "Secret code created successfully";
};
exports.createSecretCodeService = createSecretCodeService;
// ================================
// Get user by registration number
// ================================
const getUserByRegNoService = async (reg_no) => {
    return db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.reg_no, reg_no),
    });
};
exports.getUserByRegNoService = getUserByRegNoService;
// ================================
// Update password
// ================================
const updateUserPasswordService = async (reg_no, newPassword) => {
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    const [updated] = await db_1.default.update(schema_1.users)
        .set({ password: hashedPassword })
        .where((0, drizzle_orm_1.eq)(schema_1.users.reg_no, reg_no))
        .returning();
    if (!updated)
        throw new Error("User not found or password update failed");
    return "Password updated successfully";
};
exports.updateUserPasswordService = updateUserPasswordService;
