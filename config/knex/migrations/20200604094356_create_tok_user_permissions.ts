import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_user_permissions", (table) => {
    table.increments();
    table
      .integer("tok_users_id")
      .unsigned()
      .references("id")
      .inTable("tok_users");
    table
      .integer("tok_permissions_id")
      .unsigned()
      .references("id")
      .inTable("tok_permissions");
    table.specificType("status", "tinyint(1)");
   	table.timestamp("created").defaultTo(knex.fn.now());
   	table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_user_permissions");
}
