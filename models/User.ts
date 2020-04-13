import { Model } from "objection";
import knex from "../config/knex";

export class User extends Model {
  static get tableName() {
    return "tok_users";
  }

  static get idColumn() {
    return "id";
  }

  /**
   * ------------------------------ QUERIES START ------------------------------
   */
  static getUsersFiltered = () => {
    return knex.raw("SELECT * FROM tok_users WHERE username LIKE :username", {
      username: `%quickBrownFox%`,
    });
  };
}
