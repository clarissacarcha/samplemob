import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_addresses", (table) => {
    table.increments();
    table.string("line1", 45).notNullable();
    table.string("line2", 45);
    table.string("barangay", 45).notNullable();
    table.string("city", 45).notNullable();
    table.string("province", 45).notNullable();
    table.string("country", 45).notNullable();
    table.string("postal", 10);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_addresses")
}
