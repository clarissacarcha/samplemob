import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_users")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_users").insert([
        //root web app user
        {
          id: 1,
          username: "root@gmail.com",
          password:
            "$2y$12$aZOiI/eXlwrOIUICPGIsheOrspHcxSXdOGivvOZf79PNGxnHjHCSa",
          access: "access",
          functions: "",
          last_seen: "2020-06-17 14:07:57",
          active: "1",
          failed_login_attempts: "0",
          status: "1",
          created: knex.fn.now(),
          updated: knex.fn.now(),
        },
      ]);
    });
}
