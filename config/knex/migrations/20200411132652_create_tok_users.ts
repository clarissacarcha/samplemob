import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tok_users", (table) => {
    table.increments();
    table.string("user_id", 12).unique();
    table.string("username", 45).notNullable();
    table.string("password", 100).notNullable();
    table.text("access");
    table.text("functions");
    table.string("device_type", 1);
    table.string("device_id", 100);
    table.dateTime("last_seen").nullable();
    table.boolean("active").defaultTo(true);
    table.specificType("failed_login_attempts", "tinyint(1)");
    /**
     * 1 - Active
     * 2 - Applicant
     * 3 - Blocked
     */
    table.specificType("status", "tinyint(1)").notNullable();
    table.timestamp("created").defaultTo(knex.fn.now());
    table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tok_users");
}
