import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_user_wallet_logs", (table) => {
    table.increments();
    table
      .integer("tok_wallet_id")
      .unsigned()
      .references("id")
      .inTable("tok_user_wallet");
    table.string("type", 45).notNullable();
    table.specificType("balance", "double");
    table.timestamp("transaction_date").defaultTo(knex.fn.now());
    table.specificType("incoming", "double");
    table.specificType("outgoing", "double");
    table
      .integer("tok_delivery_id")
      .unsigned()
      .references("id")
      .inTable("tok_deliveries");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_user_wallet_logs");
}
