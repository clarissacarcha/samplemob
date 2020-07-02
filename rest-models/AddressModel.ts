//@ts-nocheck
const pool = require("../mysql");
const dateFormat = require("dateformat");
import { MysqlUtility } from "../util/MysqlUtility";

export class AddressModel {
  static create = async (req: any) => {
    let query = MysqlUtility.mergeLines([
      "insert into tok_addresses",
      "(line1,line2, barangay,city,province,country,postal)",
      "values(?,?,?,?,?,?,?)",
    ]);

    let values = [
      req.line_1,
      req.line_2,
      req.barangay,
      req.city,
      req.province,
      req.country,
      req.postal_code,
    ];

    let addressResult = await pool.query(query, values);

    return addressResult.insertId;
  };

  static read = async (id: number) => {
    let query = "select * from tok_addresses where id = ?";

    return await pool.query(query, [id]);
  };

  static update = async (req: any) => {
    let query = MysqlUtility.mergeLines([
      "update tok_addresses set",
      "line1 = ? ,",
      "line2 = ? ,",
      "barangay = ? ,",
      "city = ?,",
      "province = ? ",
      "country = ? ",
      "postal = ?",
      "where id = ?",
    ]);

    let values = [
      req.line_1,
      req.line_2,
      req.barangay,
      req.city,
      req.province,
      req.country,
      req.postal_code,
      req.id,
    ];

    return await pool.query(query, values);
  };
}
