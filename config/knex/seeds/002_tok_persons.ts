import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_persons")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_persons").insert([
        //root web app user
        {
          id: 1,
          first_name: "Root",
          middle_name: "",
          last_name: "User",
          mobile_number: null,
          birthdate: null,
          gender: null,
          avatar: "avatarplaceholder.png",
          status: "1",
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
          tok_user_id: "1",
          tok_address_id: null,
        },
      ]);
    });
}
