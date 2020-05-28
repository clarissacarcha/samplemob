import { Model } from "objection";
<<<<<<< HEAD

export default class extends Model {
  static tableName = "tok_drivers";
  static idColumn = "id";
=======
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
>>>>>>> dc738aa236fe6efde23a45a1b481b09f017eb04f
}
