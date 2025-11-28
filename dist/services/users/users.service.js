"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserEligibilityService = exports.deleteUserService = exports.updateUserService = exports.getUserByRegNoService = exports.getUserByEmailService = exports.getUserByLastNameService = exports.getUserByUserIdService = exports.getUsersBySchoolService = exports.getUsersCountBySchoolService = exports.getUsersCountService = exports.getAllUsersService = void 0;
const db_1 = __importDefault(require("../../drizzle/db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_2 = require("drizzle-orm");
// Helper to remove password from returned user objects
function excludePassword(user) {
    const { password, ...rest } = user;
    return rest;
}
/**
 * Get all users (without passwords)
 */
const getAllUsersService = async () => {
    const userList = await db_1.default.query.users.findMany({ orderBy: [(0, drizzle_orm_1.desc)(schema_1.users.id)] });
    return userList.map(excludePassword);
};
exports.getAllUsersService = getAllUsersService;
/**
 * Get total count of users
 */
const getUsersCountService = async () => {
    const [result] = await db_1.default.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.users);
    return Number(result.count ?? 0);
};
exports.getUsersCountService = getUsersCountService;
/**
 * Get total count of users by school
 */
const getUsersCountBySchoolService = async (school) => {
    const [result] = await db_1.default
        .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
        .from(schema_1.users)
        .where((0, drizzle_orm_2.eq)(schema_1.users.school, school));
    return Number(result.count ?? 0);
};
exports.getUsersCountBySchoolService = getUsersCountBySchoolService;
/**
 * Get users by school
 */
const getUsersBySchoolService = async (school) => {
    const userList = await db_1.default.query.users.findMany({
        where: (0, drizzle_orm_2.eq)(schema_1.users.school, school),
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.users.reg_no)],
    });
    return userList.map(excludePassword);
};
exports.getUsersBySchoolService = getUsersBySchoolService;
/**
 * Get a single user by ID
 */
const getUserByUserIdService = async (id) => {
    const user = await db_1.default.query.users.findFirst({ where: (0, drizzle_orm_2.eq)(schema_1.users.id, id) });
    return user ? excludePassword(user) : undefined;
};
exports.getUserByUserIdService = getUserByUserIdService;
/**
 * Search users by last name (partial match)
 */
const getUserByLastNameService = async (lastName) => {
    const results = await db_1.default.query.users.findMany({
        where: (0, drizzle_orm_1.ilike)(schema_1.users.name, `%${lastName}%`),
    });
    return results.map(excludePassword);
};
exports.getUserByLastNameService = getUserByLastNameService;
/**
 * Get user by email
 */
const getUserByEmailService = async (email) => {
    return db_1.default.query.users.findFirst({ where: (0, drizzle_orm_2.eq)(schema_1.users.email, email) });
};
exports.getUserByEmailService = getUserByEmailService;
/**
 * Get user by registration number
 */
const getUserByRegNoService = async (regNo) => {
    return db_1.default.query.users.findFirst({ where: (0, drizzle_orm_2.eq)(schema_1.users.reg_no, regNo) });
};
exports.getUserByRegNoService = getUserByRegNoService;
/**
 * Update a user (password is hashed if present)
 */
const updateUserService = async (id, updates) => {
    if (updates.password) {
        const salt = bcrypt_1.default.genSaltSync(10);
        updates.password = bcrypt_1.default.hashSync(updates.password, salt);
    }
    const [updatedUser] = await db_1.default.update(schema_1.users).set(updates).where((0, drizzle_orm_2.eq)(schema_1.users.id, id)).returning();
    return updatedUser ? excludePassword(updatedUser) : null;
};
exports.updateUserService = updateUserService;
/**
 * Delete a user
 */
const deleteUserService = async (id) => {
    await db_1.default.delete(schema_1.users).where((0, drizzle_orm_2.eq)(schema_1.users.id, id));
    return "User deleted successfully";
};
exports.deleteUserService = deleteUserService;
/**
 * Check if user is eligible to vote
 */
const checkUserEligibilityService = (user) => {
    return user.graduation_status === "active" && user.has_secret_code && user.has_face_verification;
};
exports.checkUserEligibilityService = checkUserEligibilityService;
