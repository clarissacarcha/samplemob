import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_drivers", (table) => {
    table.increments();
    table.string("license_number", 45).notNullable();
    table.specificType("rating", "tinyint(1)");
    table.specificType("status", "tinyint(1)");
    table.boolean("is_online").defaultTo(false);
    table.specificType("last_latitude", "decimal(18,15)").notNullable();
    table.specificType("last_longitude", "decimal(18,15)").notNullable();
    table.dateTime("last_location_update");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .integer("tok_user_id")
      .unsigned()
      .references("id")
      .inTable("tok_users");
    table
      .integer("tok_account_level_id")
      .unsigned()
      .references("id")
      .inTable("tok_account_levels");
    table
      .integer("tok_vehicle_id")
      .unsigned()
      .references("id")
      .inTable("tok_vehicles");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_drivers");
}
