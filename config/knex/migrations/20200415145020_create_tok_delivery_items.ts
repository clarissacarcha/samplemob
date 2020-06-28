import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_delivery_items", (table) => {
    table.increments();
    table.string("item", 100).notNullable();
    table.specificType("quantity", "tinyint(11)");
    table.string("unit", 45).notNullable();
    table.specificType("weight_grams", "int(11)");
    table.specificType("size_cm", "int(11)");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .integer("tok_delivery_id")
      .unsigned()
      .references("id")
      .inTable("tok_deliveries");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_delivery_items");
}
