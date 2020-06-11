//@ts-nocheck
require("dotenv").config();
import Knex from "knex";
import { knexProfiler } from "../../util";
import { knexSnakeCaseMappers } from "objection";

// Initialize knex.
const knex = Knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  },
  ...knexSnakeCaseMappers(),
});

if (process.env.NODE_ENV === "development") {
  // knexProfiler(knex);
}

export default knex;
