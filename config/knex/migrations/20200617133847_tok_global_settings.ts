import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_global_settings", (table) => {
    table.increments();
    table.string("description", 100).notNullable();
    table.string("key", 100).notNullable();
    table.string("key_value", 100).notNullable();
    table.string("unit", 100);
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_global_settings");
}
