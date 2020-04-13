import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, name: "Alvir", email: "alvir@gmail.com" },
        { id: 2, name: "Melen", email: "melen@gmail.com" },
        { id: 3, name: "Myutini", email: "myutini@gmail.com" },
      ]);
    });
}
