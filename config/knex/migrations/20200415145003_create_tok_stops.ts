import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_stops", (table) => {
    table.increments();
    table.string("name", 50).notNullable;
    table.string("mobile", 50).notNullable;
    table.string("landmark", 150).nullable;
    table.string("formatted_address", 255).notNullable;
    table.specificType("latitude", "decimal(18,15)").notNullable;
    table.specificType("longitude", "decimal(18,15)").notNullable;
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_stops");
}
