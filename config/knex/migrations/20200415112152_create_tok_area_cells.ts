import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_area_cells", (table) => {
    table.increments();
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_area_type_id").unsigned().references("id").inTable("tok_area_types");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_area_cells");
}

