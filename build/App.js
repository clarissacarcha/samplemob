"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const objection_1 = require("objection");
const knex_1 = __importDefault(require("./config/knex"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
//import routes
const index_1 = __importDefault(require("./routes/index"));
const VehicleTypeRoutes_1 = __importDefault(require("./routes/VehicleTypeRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const VehicleBrandRoutes_1 = __importDefault(require("./routes/VehicleBrandRoutes"));
const VehicleModelRoutes_1 = __importDefault(require("./routes/VehicleModelRoutes"));
const CargoTypeRoutes_1 = __importDefault(require("./routes/CargoTypeRoutes"));
const UserAccessControlRoutes_1 = __importDefault(require("./routes/UserAccessControlRoutes"));
const RoleRoutes_1 = __importDefault(require("./routes/RoleRoutes"));
const RequirementTypeRoutes_1 = __importDefault(require("./routes/RequirementTypeRoutes"));
const AccountLevelTypeRoutes_1 = __importDefault(require("./routes/AccountLevelTypeRoutes"));
const AccountLevelRoutes_1 = __importDefault(require("./routes/AccountLevelRoutes"));
const DriverRoutes_1 = __importDefault(require("./routes/DriverRoutes"));
// Initialize express instance
const app = express_1.default();
//Sets the knex instance to be used by Objection models by default
objection_1.Model.knex(knex_1.default);
// Body Parser
app.use(body_parser_1.default.json());
// Cookie Parser
app.use(cookie_parser_1.default());
// Set Security Headers
app.use(helmet_1.default());
// Prevent XSS attacks
app.use(xss_clean_1.default());
// Rate Limiting | 120 requests per minute
app.use(express_rate_limit_1.default({
    windowMs: 60 * 1000,
    max: 120,
}));
// Prevent HTTP Param Pollution
app.use(hpp_1.default());
// Allow CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// Assign Routes
app.use("/sample", index_1.default);
app.use("/vehicletype", VehicleTypeRoutes_1.default);
app.use("/vehiclebrand", VehicleBrandRoutes_1.default);
app.use("/vehiclemodel", VehicleModelRoutes_1.default);
app.use("/cargotype", CargoTypeRoutes_1.default);
app.use("/useraccesscontrol", UserAccessControlRoutes_1.default);
app.use("/role", RoleRoutes_1.default);
app.use("/requirementtype", RequirementTypeRoutes_1.default);
app.use("/accountleveltype", AccountLevelTypeRoutes_1.default);
app.use("/accountlevel", AccountLevelRoutes_1.default);
app.use("/driver", DriverRoutes_1.default);
app.use("/user", UserRoutes_1.default);
exports.default = app;
