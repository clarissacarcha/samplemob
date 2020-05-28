import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_delivery_logs", (table) => {
    table.increments();
    table.specificType("status", "tinyint(1)").notNullable;
    table.string("image", 100).nullable;
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("tok_delivery_id").unsigned().references("id").inTable("tok_deliveries")
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_delivery_logs");
}
