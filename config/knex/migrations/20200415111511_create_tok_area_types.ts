import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_area_types", (table) => {
    table.increments();
    table.string("area_name", 45).notNullable();
    table.specificType("price_surge_base", "double");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_area_types");
}

