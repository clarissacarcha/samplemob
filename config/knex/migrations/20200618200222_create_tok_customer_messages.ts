import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_messages", (table) => {
    table.increments();
    table.string("title", 255).notNullable; // Maximum 120 characters to not be truncated
    table.text("body").notNullable;
    /**
     * 1 - Unread
     * 2 - Read
     */
    table.specificType("status", "tinyint(1)");
    table.dateTime("created_at").defaultTo(knex.fn.now());
    table
      .integer("tok_user_id")
      .unsigned()
      .references("id")
      .inTable("tok_users");
    table
      .integer("tok_delivery_id")
      .unsigned()
      .references("id")
      .inTable("tok_deliveries");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_messages");
}
