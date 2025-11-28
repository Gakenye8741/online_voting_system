"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGraduationStatusService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../drizzle/db"));
const schema_1 = require("../../drizzle/schema");
// Only Dean of the school or Admin can update
const updateGraduationStatusService = async (reg_no, newStatus) => {
    const [updatedUser] = await db_1.default.update(schema_1.users)
        .set({ graduation_status: newStatus })
        .where((0, drizzle_orm_1.eq)(schema_1.users.reg_no, reg_no))
        .returning();
    if (!updatedUser)
        throw new Error("Failed to update graduation status");
    return updatedUser;
};
exports.updateGraduationStatusService = updateGraduationStatusService;
