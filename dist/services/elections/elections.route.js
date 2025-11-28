"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// elections.routes.ts
const express_1 = require("express");
const elections_controller_1 = require("./elections.controller");
const bearAuth_1 = require("../../middlewares/bearAuth");
const ElectionRouter = (0, express_1.Router)();
// -------------------------------
// Election CRUD (Admins only)
// -------------------------------
ElectionRouter.post("/", bearAuth_1.adminAuth, elections_controller_1.createElection);
ElectionRouter.get("/", bearAuth_1.anyAuthenticatedUser, elections_controller_1.getAllElections);
ElectionRouter.get("/:id", bearAuth_1.anyAuthenticatedUser, elections_controller_1.getElectionById);
ElectionRouter.put("/:id", bearAuth_1.adminAuth, elections_controller_1.updateElection);
ElectionRouter.delete("/:id", bearAuth_1.adminAuth, elections_controller_1.deleteElection);
// -------------------------------
// Election status
// -------------------------------
ElectionRouter.patch("/:id/status", bearAuth_1.adminAuth, elections_controller_1.changeElectionStatus);
ElectionRouter.get("/status/filter", bearAuth_1.anyAuthenticatedUser, elections_controller_1.getElectionsByStatus);
exports.default = ElectionRouter;
