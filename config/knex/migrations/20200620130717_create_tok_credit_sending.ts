import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_credit_sending", (table) => {
    table.increments();
    table.string("reference_number", 45).notNullable();
    table.specificType("transaction_type", "tinyint(1)");
    table
      .integer("tok_user_sender")
      .unsigned()
      .references("id")
      .inTable("tok_users");
    table
      .integer("tok_user_receiver")
      .unsigned()
      .references("id")
      .inTable("tok_users");
    table.dateTime("transaction_date").defaultTo(knex.fn.now());
    table.specificType("amount", "double");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_credit_sending");
}
