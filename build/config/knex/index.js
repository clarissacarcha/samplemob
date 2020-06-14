"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
require("dotenv").config();
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
// Initialize knex.
const knex = knex_1.default(Object.assign({ client: "mysql2", connection: {
        timezone: "+00:00",
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    } }, objection_1.knexSnakeCaseMappers()));
if (process.env.NODE_ENV === "development") {
    // knexProfiler(knex);
}
exports.default = knex;
