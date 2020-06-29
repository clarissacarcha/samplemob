import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_driver_location_logs", (table) => {
    table.increments();
    table.specificType("latitude", "decimal(18,15)").notNullable();
    table.specificType("longitude", "decimal(18,15)").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .integer("tok_driver_id")
      .unsigned()
      .references("id")
      .inTable("tok_drivers");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_driver_location_logs");
}
