import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_users")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_users").insert([
        //root web app user
        { id: 1, 
          username: "root@gmail.com", 
          password: "$2b$10$b44S2p6.oPFcjFx9ODQPOOJO2S2tlkglVXC/aDkBN.jd.4QTsheEe",
          access: "access",
          active: "1",
          failed_login_attempts: "0",
          status: "1",
          created: "2020-06-17 14:07:57",
          updated: "2020-06-17 14:07:57"
        }
      ]);
    });
}
