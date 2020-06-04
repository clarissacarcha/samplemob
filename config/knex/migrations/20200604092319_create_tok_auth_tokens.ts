import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_auth_tokens", (table) => {
    table.increments();
    table.string("token", 150).notNullable();
    table
      .integer("tok_users_id")
      .unsigned()
      .references("id")
      .inTable("tok_users");
    table.string("roles", 6000).nullable();
    table.string("permissions",10000).nullable();
   	table.timestamp("created_at").defaultTo(knex.fn.now());
   	table.timestamp("last_activity").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_auth_tokens");
}
