import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_permissions", (table) => {
    table.increments();
    table.string("permission_code", 30).notNullable();
    table.string("description", 45).nullable();
    table.specificType("status", "tinyint(1)");
   	table.timestamp("created").defaultTo(knex.fn.now());
   	table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_permissions");
}
