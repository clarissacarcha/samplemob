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

// Initialize express instance
const app: Application = express();

//Sets the knex instance to be used by Objection models by default
Model.knex(knex);

export default app;

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

app.use("/user", userroute);
