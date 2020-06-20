import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_roles")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_roles").insert([
        //root web app user
        {
          id: 1,
          role: "Root",
          status: "1",
          created: knex.fn.now(),
          updated: knex.fn.now(),
        },
        {
          id: 2,
          role: "Driver",
          status: "1",
          created: knex.fn.now(),
          updated: knex.fn.now(),
        },
        {
          id: 3,
          role: "Operator",
          status: "1",
          created: knex.fn.now(),
          updated: knex.fn.now(),
        },
        {
          id: 4,
          role: "Regular",
          status: "1",
          created: knex.fn.now(),
          updated: knex.fn.now(),
        },
      ]);
    });
}
