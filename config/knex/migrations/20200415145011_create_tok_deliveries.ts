import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_deliveries", (table) => {
    table.increments();
    table.string("description", 150).nullable;
    table.string("notes", 150).nullable;
    table.decimal("distance", 10, 2);
    table.integer("duration", 5);
    table.specificType("price", "double");
    table.specificType("rating", "tinyint(1)");
    table.text("cargo");
    /**
     * 1 - Order Placed
     * 2 - Delivery Scheduled
     * 3 - Driver In Transit to Pick Up
     * 4 - Item picked up
     * 5 - Driver in Transit to Deliver
     * 6 - Item delivered
     * 7 - Order Cancelled
     * 8 - Order Deleted
     * 9 - Order Expired
     */
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .integer("tok_consumer_id")
      .unsigned()
      .references("id")
      .inTable("tok_consumers");
    table
      .integer("tok_vehicle_id")
      .unsigned()
      .references("id")
      .inTable("tok_vehicles");
    table
      .integer("tok_driver_id")
      .unsigned()
      .references("id")
      .inTable("tok_drivers");
    table
      .integer("sender_tok_stop_id")
      .unsigned()
      .references("id")
      .inTable("tok_stops");
    table
      .integer("recipient_tok_stop_id")
      .unsigned()
      .references("id")
      .inTable("tok_stops");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_deliveries");
}
