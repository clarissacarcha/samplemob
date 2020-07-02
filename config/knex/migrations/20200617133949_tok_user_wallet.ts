import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_user_wallets", (table) => {
    table.increments();
    table.specificType("balance", "double").defaultTo(0);
    table.specificType("status", "tinyint(1)");
    table.timestamp("created").defaultTo(knex.fn.now());
    table.timestamp("updated").defaultTo(knex.fn.now());
    table
      .integer("tok_user_id")
      .unsigned()
      .references("id")
      .inTable("tok_users");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_user_wallets");
}
