import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("tok_role_permissions")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("tok_role_permissions").insert([
        //root
        { id: 1, tok_roles_id: 1, tok_permissions_id: 1, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 2, tok_roles_id: 1, tok_permissions_id: 2, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 3, tok_roles_id: 1, tok_permissions_id: 3, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 4, tok_roles_id: 1, tok_permissions_id: 4, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 5, tok_roles_id: 1, tok_permissions_id: 5, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 6, tok_roles_id: 1, tok_permissions_id: 6, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 7, tok_roles_id: 1, tok_permissions_id: 7, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 8, tok_roles_id: 1, tok_permissions_id: 8, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 9, tok_roles_id: 1, tok_permissions_id: 9, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 10, tok_roles_id: 1, tok_permissions_id: 10, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 11, tok_roles_id: 1, tok_permissions_id: 11, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 12, tok_roles_id: 1, tok_permissions_id: 12, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 13, tok_roles_id: 1, tok_permissions_id: 13, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 14, tok_roles_id: 1, tok_permissions_id: 14, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 15, tok_roles_id: 1, tok_permissions_id: 15, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 16, tok_roles_id: 1, tok_permissions_id: 16, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 17, tok_roles_id: 1, tok_permissions_id: 17, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 18, tok_roles_id: 1, tok_permissions_id: 18, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 19, tok_roles_id: 1, tok_permissions_id: 19, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 20, tok_roles_id: 1, tok_permissions_id: 20, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 21, tok_roles_id: 1, tok_permissions_id: 21, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 22, tok_roles_id: 1, tok_permissions_id: 22, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 23, tok_roles_id: 1, tok_permissions_id: 23, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 24, tok_roles_id: 1, tok_permissions_id: 24, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 25, tok_roles_id: 1, tok_permissions_id: 25, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 26, tok_roles_id: 1, tok_permissions_id: 26, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 27, tok_roles_id: 1, tok_permissions_id: 27, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 28, tok_roles_id: 1, tok_permissions_id: 28, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 29, tok_roles_id: 1, tok_permissions_id: 29, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 30, tok_roles_id: 1, tok_permissions_id: 30, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 31, tok_roles_id: 1, tok_permissions_id: 31, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 32, tok_roles_id: 1, tok_permissions_id: 32, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },

        //Driver
        { id: 33, tok_roles_id: 2, tok_permissions_id: 31, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 34, tok_roles_id: 2, tok_permissions_id: 32, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 35, tok_roles_id: 2, tok_permissions_id: 35, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 36, tok_roles_id: 2, tok_permissions_id: 36, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 37, tok_roles_id: 2, tok_permissions_id: 37, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },

        //Operator
        { id: 38, tok_roles_id: 3, tok_permissions_id: 31, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 39, tok_roles_id: 3, tok_permissions_id: 32, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 40, tok_roles_id: 3, tok_permissions_id: 33, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 41, tok_roles_id: 3, tok_permissions_id: 34, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 42, tok_roles_id: 3, tok_permissions_id: 35, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },

        //Regular
        { id: 43, tok_roles_id: 4, tok_permissions_id: 36, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" },
        { id: 44, tok_roles_id: 4, tok_permissions_id: 37, status: "1", created: "0000-00-00 00:00:00", updated: "0000-00-00 00:00:00" }

      ]);
    });
}
