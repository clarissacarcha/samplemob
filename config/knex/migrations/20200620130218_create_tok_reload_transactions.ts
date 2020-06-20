import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_reload_transactions", (table) => {
    table.increments();
    table.string("reference_number",45).notNullable;
    table.integer("tok_user_id").unsigned().references("id").inTable("tok_users");
    table.dateTime("transation_date").defaultTo(knex.fn.now());
    table.dateTime("payment_date").defaultTo(knex.fn.now());
    table.specificType("amount", "double");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_reload_transactions");
}
