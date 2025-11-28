"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userValidator = zod_1.default.object({
    reg_no: zod_1.default.string().min(3, "Registration number must be at least 3 characters"),
    role: zod_1.default.enum(["voter", "admin"]).default("voter"),
    // Optional fields
    name: zod_1.default.string().min(2).optional(),
    email: zod_1.default.string().email().optional(),
    school: zod_1.default.enum([
        "Science",
        "Education",
        "Business",
        "Humanities and Developmental_Studies",
        "TVET",
    ]).optional(),
    expected_graduation: zod_1.default
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Graduation must be in MM/YYYY format")
        .optional(),
    graduation_status: zod_1.default
        .enum(["active", "graduated", "deferred", "inactive"])
        .default("active"),
    // Security fields
    secret_code_hash: zod_1.default.string().optional(),
    has_secret_code: zod_1.default.boolean().default(false),
    face_embedding: zod_1.default.string().optional(),
    has_face_verification: zod_1.default.boolean().default(false),
    // Password field
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
});
