import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_persons", (table) => {
    table.increments();
    table.string("first_name", 45).notNullable();
    table.string("middle_name", 45);
    table.string("last_name", 45).notNullable();
    table.string("mobile_number", 15);
    table.string("email_address", 100);
    table.date("birthdate");
    table.specificType("gender", "tinyint(1)");
    table.string("avatar", 45);
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_user_id").unsigned().references("id").inTable("tok_users");
    table.integer("tok_address_id").unsigned().references("id").inTable("tok_addresses");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_persons");
}

