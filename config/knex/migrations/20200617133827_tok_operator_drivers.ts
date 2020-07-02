import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_operator_drivers", (table) => {
    table.increments();
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_operator_id").unsigned().references("id").inTable("tok_operators");
    table.integer("tok_driver_id").unsigned().references("id").inTable("tok_drivers");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_operator_drivers");
}

