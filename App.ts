//@ts-nocheck
import express, { Application } from "express";
import { Model } from "objection";
import knex from "./config/knex";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

//import routes
import indexroute from "./routes/index";
import vehicletyperoute from "./routes/VehicleTypeRoutes";
import userroute from "./routes/UserRoutes";
import vehiclebrandroute from "./routes/VehicleBrandRoutes";
import vehiclemodelroute from "./routes/VehicleModelRoutes";
import cargotyperoute from "./routes/CargoTypeRoutes";
import useraccesscontrolroute from "./routes/UserAccessControlRoutes";
import roleroute from "./routes/RoleRoutes";
import requirementtyperoute from "./routes/RequirementTypeRoutes";
import accountleveltyperoute from "./routes/AccountLevelTypeRoutes";
import accountlevelroute from "./routes/AccountLevelRoutes";
import driverroute from "./routes/DriverRoutes";

// Initialize express instance
const app: Application = express();

//Sets the knex instance to be used by Objection models by default
Model.knex(knex);

// Body Parser
app.use(bodyParser.json());

// Cookie Parser
app.use(cookieParser());

// Set Security Headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting | 120 requests per minute
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120,
  })
);

// Prevent HTTP Param Pollution
app.use(hpp());

// Allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

// Assign Routes
app.use("/sample", indexroute);

app.use("/vehicletype", vehicletyperoute);

app.use("/vehiclebrand", vehiclebrandroute);

app.use("/vehiclemodel", vehiclemodelroute);

app.use("/cargotype", cargotyperoute);

app.use("/useraccesscontrol", useraccesscontrolroute);

app.use("/role", roleroute);

app.use("/requirementtype", requirementtyperoute);

app.use("/accountleveltype", accountleveltyperoute);

app.use("/accountlevel", accountlevelroute);

app.use("/driver", driverroute);

app.use("/user", userroute);

export default app;
