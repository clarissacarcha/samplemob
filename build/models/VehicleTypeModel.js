"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const knex_1 = __importDefault(require("../config/knex"));
class VehicleTypeModel extends objection_1.Model {
    static get tableName() {
        return "tok_vehicle_types";
    }
    static get idColumn() {
        return "id";
    }
}
exports.VehicleTypeModel = VehicleTypeModel;
/**
 * ------------------------------ QUERIES START ------------------------------
 */
VehicleTypeModel.getUsersFiltered = () => {
    return knex_1.default.raw("SELECT * FROM tok_users WHERE username LIKE :username", {
        username: `%quickBrownFox%`,
    });
};
VehicleTypeModel.get_users = () => {
    return "hahaha";
};
VehicleTypeModel.getUser = (id) => {
    return knex_1.default.raw("SELECT * FROM tok_users WHERE id = :userId", {
        userId: id
    });
};
VehicleTypeModel.create = (req) => {
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
    const res = {
        successful: false,
        message: "Something went wrong",
        id: "1"
    };
    return res;
};
VehicleTypeModel.get = () => {
    let vtypes = [
        {
            id: 1,
            type: 'Sedan'
        },
        {
            id: 2,
            type: '6 seater'
        },
        {
            id: 3,
            type: 'truck'
        }
    ];
    return vtypes;
};
