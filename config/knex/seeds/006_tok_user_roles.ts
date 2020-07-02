import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_user_roles")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_user_roles").insert([
        //root web app user
        {
          id: 1,
          tok_roles_id: 1,
          tok_users_id: 1,
          status: "1",
          created: knex.fn.now(),
          updated: knex.fn.now(),
        },
      ]);
    });
}
