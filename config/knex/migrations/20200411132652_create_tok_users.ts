import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_users", (table) => {
    table.increments();
    table.string("username", 45).notNullable();
<<<<<<< HEAD
    table.string("password", 45).notNullable();
=======
    table.string("password",100 ).notNullable();
>>>>>>> dc738aa236fe6efde23a45a1b481b09f017eb04f
    table.text("access");
    table.boolean("active").defaultTo(true);
    table.specificType("failed_login_attempts", "tinyint(1)");
    table.specificType("status", "tinyint(1)");
    table.timestamp("created").defaultTo(knex.fn.now());
    table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_users");
}
