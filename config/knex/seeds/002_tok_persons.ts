import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_persons")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_persons").insert([
        //root web app user
        { id: 1, 
          first_name: "Root",
          middle_name: "",
          last_name: "User",
          mobile_number: null,
          birthdate: null,
          gender: null,
          avatar: "../assets/img/avatarplaceholder.png",  
          status: "1",
          created_at: "2020-06-17 14:07:57",
          updated_at: "2020-06-17 14:07:57",
          tok_user_id: "1",
          tok_address_id: null
        }
      ]);
    });
}
