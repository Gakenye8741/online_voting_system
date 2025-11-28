"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const Auth_routes_1 = __importDefault(require("./Auth/Auth.routes"));
require("./utils/cron");
const graduation_routes_1 = __importDefault(require("./services/graduation/graduation.routes"));
const users_routes_1 = __importDefault(require("./services/users/users.routes"));
const elections_route_1 = __importDefault(require("./services/elections/elections.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Basic Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//default route
app.get('/', (req, res) => {
    res.send("Laikipia University App is running");
});
//import route
const PORT = process.env.PORT || 5000;
app.use('/api/auth/', Auth_routes_1.default);
app.use('/api/graduation', graduation_routes_1.default);
app.use('/api/users/', users_routes_1.default);
app.use('/api/elections/', elections_route_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
