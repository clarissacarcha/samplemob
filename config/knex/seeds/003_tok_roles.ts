import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_roles")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_roles").insert([
        //root web app user
        { id: 1,
          role: "Root",
          status: "1",
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        },
        { id: 2,
          role: "Driver",
          status: "1",
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        },
        { id: 3,
          role: "Operator",
          status: "1",
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        },
        { id: 4,
          role: "Regular",
          status: "1",
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        }
      ]);
    });
}
