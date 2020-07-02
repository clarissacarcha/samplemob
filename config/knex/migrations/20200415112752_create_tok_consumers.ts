import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_consumers", (table) => {
    table.increments();
    table.specificType("rating", "tinyint(1)");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_user_id").unsigned().references("id").inTable("tok_users");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_consumers");
}

