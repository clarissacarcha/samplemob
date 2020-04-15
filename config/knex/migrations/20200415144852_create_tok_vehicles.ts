import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_vehicles", (table) => {
    table.increments();
    table.string("plate_number", 20).notNullable();
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_vehicle_type_id").unsigned().references("id").inTable("tok_vehicle_types");
    table.integer("tok_vehicle_brand_id").unsigned().references("id").inTable("tok_vehicle_brands");
    table.integer("tok_vehicle_model_id").unsigned().references("id").inTable("tok_vehicle_models");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_vehicles");
}

