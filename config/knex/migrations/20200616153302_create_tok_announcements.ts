import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_announcements", (table) => {
    table.increments();
    /*
      C - Customer
      D - Driver
    */
    table.string("app_flavor", 1).notNullable();
    table.string("title", 255).notNullable(); // Maximum 120 characters to not be truncated
    table.text("body").notNullable();
    table.string("thumbnail", 255).notNullable();
    table.string("image", 255).notNullable();
    table.specificType("status", "tinyint(1)");
    table.dateTime("created_at").defaultTo(knex.fn.now());
    table.dateTime("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_announcements");
}
