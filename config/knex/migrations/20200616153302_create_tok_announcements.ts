import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_announcements", (table) => {
    table.increments();
    table.string("title", 255).notNullable; // Maximum 120 characters to not be truncated
    table.text("body").notNullable;
    table.string("thumbnail", 255).notNullable;
    table.string("image", 255).notNullable;
    table.specificType("status", "tinyint(1)");
    table.dateTime("created_at");
    table.dateTime("updated_at");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_announcements");
}
