"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const graduation_controller_1 = require("./graduation.controller");
const bearAuth_1 = require("../../middlewares/bearAuth");
const GraduationRouter = (0, express_1.Router)();
// Only Deans and Admins can manually update
GraduationRouter.put("/update/:reg_no", (0, bearAuth_1.authMiddleware)("any"), // we check role in controller
graduation_controller_1.updateGraduationStatus);
exports.default = GraduationRouter;
