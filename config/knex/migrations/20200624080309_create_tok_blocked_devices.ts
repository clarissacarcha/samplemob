import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_blocked_devices", (table) => {
    table.increments();
    table.string("device_type", 1).notNullable();
    table.string("device_id", 100).notNullable();
    table.text("reason");
    table.dateTime("created_at").defaultTo(knex.fn.now());
    table
      .integer("tok_user_id")
      .unsigned()
      .references("id")
      .inTable("tok_users");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_blocked_devices");
}
