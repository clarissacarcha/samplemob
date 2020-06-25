//@ts-nocheck
const pool = require("../mysql");
const dateFormat = require("dateformat");
import { MysqlUtility } from "../util/MysqlUtility";
import { AuthUtility } from "../util/AuthUtility";

export class PersonModel {
  static create = async (req: any) => {
    //insert to tok_users table
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //insert to tok_persons table
    let query = MysqlUtility.mergeLines([
      "insert into tok_persons",
      "(first_name,middle_name,last_name,email_address,status,created_at,updated_at,tok_user_id, tok_address_id)",
      "values(?,?,?,?,?,?,?,?)",
    ]);

    let values = [
      req.firstName,
      req.middleName,
      req.lastName,
      req.email,
      1,
      date,
      date,
      req.userId,
    ];

    pool.query(query, values);
  };

  static drivercreate = async (req: any) => {
    //insert to tok_users table
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //insert to tok_persons table
    let query = MysqlUtility.mergeLines([
      "insert into tok_persons",
      "(first_name,middle_name,last_name,mobile_number,email_address,status,created_at,updated_at,tok_user_id, tok_address_id)",
      "values(?,?,?,?,?,?,?,?,?,?)",
    ]);

    let values = [
      req.firstName,
      req.middleName,
      req.lastName,
      req.mobile_number,
      req.email,
      1,
      date,
      date,
      req.userId,
      req.addressId,
    ];

    pool.query(query, values);
  };
}
