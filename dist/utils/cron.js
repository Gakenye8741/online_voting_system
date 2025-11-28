"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// cronJobs.ts
const node_cron_1 = __importDefault(require("node-cron"));
const graduation_controller_1 = require("../services/graduation/graduation.controller");
const elections_service_1 = require("../services/elections/elections.service");
// -------------------------------
// Graduation Status Cron
// -------------------------------
console.log("Graduation status cron job initialized.");
// Runs every 5 minutes
node_cron_1.default.schedule("*/5 * * * *", async () => {
    console.log(`[${new Date().toISOString()}] Running graduation status update...`);
    try {
        await (0, graduation_controller_1.autoUpdateGraduationStatus)();
        console.log(`[${new Date().toISOString()}] Graduation statuses updated successfully.`);
    }
    catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to update graduation statuses:`, err);
    }
});
// -------------------------------
// Election Status Cron
// -------------------------------
console.log("Election status cron job initialized.");
// Runs every 5 minutes
node_cron_1.default.schedule("*/5 * * * *", async () => {
    console.log(`[${new Date().toISOString()}] Running election status update...`);
    try {
        await (0, elections_service_1.autoUpdateElectionStatusService)();
        console.log(`[${new Date().toISOString()}] Election statuses updated successfully.`);
    }
    catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to update election statuses:`, err);
    }
});
