import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_users", (table) => {
    table.increments();
    table.string("username", 45).notNullable();
    table.string("password", 100).notNullable();
    table.text("access");
    table.text("functions");
    table.dateTime('last_seen').nullable();
    table.boolean("active").defaultTo(true);
    table.specificType("failed_login_attempts", "tinyint(1)");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created").defaultTo(knex.fn.now());
    table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_users");
}
