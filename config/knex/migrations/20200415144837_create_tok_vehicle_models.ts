import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_vehicle_models", (table) => {
    table.increments();
    table.string("model", 45).notNullable();
    table.string("model_year", 45).notNullable();
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_vehicle_models");
}

