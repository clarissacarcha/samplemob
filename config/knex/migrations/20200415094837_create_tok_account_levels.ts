import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_account_levels", (table) => {
    table.increments();
    table.specificType("account_level", "tinyint(1)");
    table.string("level_name", 45).notNullable();
    table.specificType("priority", "tinyint(4)");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("tok_account_level_type_id").unsigned().references("id").inTable("tok_account_level_types");
  });
  
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_account_levels");
}

