//@ts-nocheck
require('dotenv').config();
import Knex from 'knex';

// Initialize knex.
const knex = Knex({
  client: 'mysql2',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    port: process.env.DB_PORT
  },
  debug: true
});

export default knex;

// // Give the knex instance to objection.
// Model.knex(knex);
