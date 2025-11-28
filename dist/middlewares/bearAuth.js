"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyAuthenticatedUser = exports.deanAuth = exports.voterAuth = exports.adminAuth = exports.authMiddleware = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Token verification helper
const verifyToken = async (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
// Auth middleware factory
const authMiddleware = (allowedRoles = "any") => {
    return async (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ error: "Authorization token is missing" });
        }
        const decodedToken = await (0, exports.verifyToken)(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        if (allowedRoles === "any" ||
            allowedRoles.includes(decodedToken.role)) {
            req.user = decodedToken;
            return next();
        }
        return res.status(403).json({
            error: "Forbidden: You do not have permission to access this resource",
        });
    };
};
exports.authMiddleware = authMiddleware;
// Role-specific middleware
exports.adminAuth = (0, exports.authMiddleware)(["admin"]);
exports.voterAuth = (0, exports.authMiddleware)(["voter"]);
exports.deanAuth = (0, exports.authMiddleware)([
    "Dean_of_Science",
    "Dean_of_Education",
    "Dean_of_Business",
    "Dean_of_Humanities_and_Developmental_Studies",
    "Dean_of_TVET",
    "Dean_of_Students",
]);
exports.anyAuthenticatedUser = (0, exports.authMiddleware)("any");
