//@ts-nocheck
import express, { Application } from "express";
import { Model } from "objection";
import knex from "./config/knex";

// Initialize express instance
const app: Application = express();

//Sets the knex instance to be used by Objection models by default
Model.knex(knex);

export default app;
