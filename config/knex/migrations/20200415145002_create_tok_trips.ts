import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_trips", (table) => {
    table.increments();
    table.string("description", 150).nullable;
    table.string("notes", 150).nullable;
    table.dateTime("book_time").defaultTo(knex.fn.now());
    table.dateTime("pickup_time").defaultTo(knex.fn.now());
    table.dateTime("drop_off_time").defaultTo(knex.fn.now());
    table.string("pickup_location",45).notNullable;
    table.string("destination",45).notNullable;
    table.string("contact_number",20).notNullable;
    table.specificType("distance_km","int(10)").notNullable;
    table.specificType("price", "double");
    table.specificType("rating", "tinyint(1)");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_consumer_id").unsigned().references("id").inTable("tok_consumers");
    table.integer("tok_vehicle_id").unsigned().references("id").inTable("tok_vehicles");
    table.integer("tok_driver_id").unsigned().references("id").inTable("tok_drivers");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_trips");
}
