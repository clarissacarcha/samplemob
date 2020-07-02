//@ts-nocheck
import { Model } from "objection";
import knex from "../config/knex";
import { Result } from "../common/interfaces/result";

export class VehicleTypeModel extends Model {
  static get tableName() {
    return "tok_vehicle_types";
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
    return "hahaha";
  };

  static getUser = (id: number) => {
    return knex.raw("SELECT * FROM tok_users WHERE id = :userId", {
      userId: id,
    });
  };

  static create = (req: any) => {
    //let query = "insert into tok_vehicle_types (id,type,seats,cargo_capacity,cargo_unit,status,created_at,updated_at) values (:id,:type,:seats,:cargo_capacity,:cargo_unit,:status,:created_at,:updated_at)";

    //return knex.raw(query);

    /*return knex.raw(query,{
      id: 4,
      type: "Something",
      seats: 3,
      cargo_capacity: 4,
      cargo_unit: "Kilos",
      status: 1,
      created_at: "2020-04-27 22:00:00",
      updated_at: "2020-04-27 22:00:00"
    });*/

    /*return knex('tok_vehicle_types').insert({
      id : 4,
      type: "Something",
      seats: 3,
      cargo_capacity: 4,
      cargo_unit: "Kilos",
      status: 1,
      created_at: "2020-04-27 22:00:00",
      updated_at: "2020-04-27 22:00:00"
    });*/

    /*const vtypes = [
      {
        type: "Something 2",
        seats: 3,
        cargo_capacity: 4,
        cargo_unit: "Kilos",
        status: 1,
        created_at: "2020-04-27 22:00:00",
        updated_at: "2020-04-27 22:00:00"
      }
    ];

    return knex('tok_vehicle_types').insert(vtypes)
    .then(() => {console.log("data inserted")})
    .catch((err:any) => { console.log(err); throw err })
    .finally(() => {
        //knex.destroy();
    });*/

    const res: Result = {
      successful: false,
      message: "Something went wrong",
      id: "1",
    };

    return res;
  };

  static get = () => {
    let vtypes = [
      {
        id: 1,
        type: "Sedan",
      },
      {
        id: 2,
        type: "6 seater",
      },
      {
        id: 3,
        type: "truck",
      },
    ];

    return vtypes;
  };
}
