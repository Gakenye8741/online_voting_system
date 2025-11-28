"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordValidator = exports.completeProfileValidator = exports.loginUserValidator = exports.registerUserValidator = exports.allowedRoles = void 0;
const zod_1 = require("zod");
/* ================================
   User Registration Validator
   Minimal fields: reg_no + password
   Password defaults to reg_no if not provided
================================ */
exports.allowedRoles = [
    "voter",
    "admin",
    "Dean_of_Science",
    "Dean_of_Education",
    "Dean_of_Business",
    "Dean_of_Humanities_and_Developmental_Studies",
    "Dean_of_TVET",
    "Dean_of_Students",
];
exports.registerUserValidator = zod_1.z.object({
    reg_no: zod_1.z
        .string()
        .min(3, "Registration number must be at least 3 characters")
        .trim()
        .regex(/^[a-zA-Z0-9\/]+$/, "Registration number can only contain letters, numbers, and slashes"),
    password: zod_1.z.string().optional(), // <-- made optional
    role: zod_1.z
        .enum(exports.allowedRoles)
        .optional()
        .default("voter"), // if not provided, defaults to "voter"
});
/* ================================
   User Login Validator
   Login via reg_no + password
================================ */
exports.loginUserValidator = zod_1.z.object({
    reg_no: zod_1.z
        .string()
        .min(3, "Registration number must be at least 3 characters"),
    password: zod_1.z.string().min(3, "Password must be at least 3 characters"),
    secret_code: zod_1.z.string().optional(), // <-- add this line
});
/* ================================
   First-time Profile Completion Validator
   Students update name, school, and expected graduation
================================ */
exports.completeProfileValidator = zod_1.z.object({
    name: zod_1.z.string().min(3),
    school: zod_1.z.enum([
        "Science",
        "Education",
        "Business",
        "Humanities and Developmental_Studies",
        "TVET",
    ]),
    expected_graduation: zod_1.z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{4}$/),
    email: zod_1.z.string().email("Invalid email"), // ✔ Added
});
/* ================================
   Password Update Validator
================================ */
exports.updatePasswordValidator = zod_1.z.object({
    password: zod_1.z.string().min(3, "Password must be at least 3 characters"),
});
