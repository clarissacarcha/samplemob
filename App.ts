//@ts-nocheck
import express, { Application } from "express";
import { Model} from 'objection';
import knex from "./config/knex";

// Initialize express instance
const app: Application = express();

// Give knex instance to objection model
Model.knex(knex);

//-------------------- TEST STARTS HERE -------------------- //
import { User } from './models';
const testing = async () => {
  const res = await User.getUsersFiltered();
  console.log(JSON.stringify({users:res[0]}, null, 2))
}
testing();
//-------------------- TEST ENDS HERE -------------------- //

export default app;
