import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("todos")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("todos").insert([
        { id: 1, title: "learn knex", user_id: 1 },
        { id: 2, title: "learn objection", user_id: 1 },
        { id: 3, title: "learn typescript", user_id: 1 },
      ]);
    });
}
