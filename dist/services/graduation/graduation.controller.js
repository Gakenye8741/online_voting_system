"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoUpdateGraduationStatus = exports.updateGraduationStatus = void 0;
const graduation_service_1 = require("./graduation.service");
const schema_1 = require("../../drizzle/schema");
const db_1 = __importDefault(require("../../drizzle/db"));
const drizzle_orm_1 = require("drizzle-orm");
// ---- Manual update by Dean/Admin ----
const updateGraduationStatus = async (req, res) => {
    try {
        const { reg_no } = req.params;
        const { graduation_status } = req.body;
        const role = req.user?.role;
        const allowedRoles = [
            "admin",
            "Dean_of_Science",
            "Dean_of_Education",
            "Dean_of_Business",
            "Dean_of_Humanities_and_Developmental_Studies",
            "Dean_of_TVET",
        ];
        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({ error: "Forbidden: Cannot update graduation status" });
        }
        if (!schema_1.graduationStatus.enumValues.includes(graduation_status)) {
            return res.status(400).json({ error: "Invalid graduation status" });
        }
        const updatedUser = await (0, graduation_service_1.updateGraduationStatusService)(reg_no, graduation_status);
        res.status(200).json({ message: "Graduation status updated", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update graduation status" });
    }
};
exports.updateGraduationStatus = updateGraduationStatus;
// ---- Automatic graduation update (cron) ----
const autoUpdateGraduationStatus = async () => {
    try {
        const students = await db_1.default.query.users.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.users.graduation_status, "active"),
        });
        const today = new Date();
        for (const student of students) {
            const [month, year] = student.expected_graduation.split("/").map(Number);
            const graduationDate = new Date(year, month - 1, 1); // MM/YYYY
            if (today >= graduationDate) {
                await (0, graduation_service_1.updateGraduationStatusService)(student.reg_no, "graduated");
                console.log(`Graduation status updated for ${student.reg_no}`);
            }
        }
    }
    catch (err) {
        console.error("Failed to auto-update graduation status:", err);
    }
};
exports.autoUpdateGraduationStatus = autoUpdateGraduationStatus;
