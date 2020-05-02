import { Model } from "objection";
import knex from "../config/knex";

export class Driver extends Model {
  static get tableName() {
    return "tok_drivers";
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

  static get_users = () => {
    return "hahaha"
  }

  static getUser = (id:number) => {
    return knex.raw("SELECT * FROM tok_users WHERE id = :userId", {
      userId: id
    });
  }
}
