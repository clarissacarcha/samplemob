//@ts-nocheck
const pool = require("../mysql");
const dateFormat = require("dateformat");
import { MysqlUtility } from "../util/MysqlUtility";

export class VehicleModelModel {
  static create = async (req: any) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
      "insert into tok_vehicle_models",
      "(model,model_year,status,created_at)",
      "values(?,?,?,?)",
    ]);

    let values = [req.model, req.model_year, 1, date];

    return await pool.query(query, values);
  };

  static read = async (id: number) => {
    let query = "select * from tok_vehicle_models where id = ?";

    return await pool.query(query, [id]);
  };

  static update = async (req: any) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
      "update tok_vehicle_models set",
      "model = ? ,",
      "model_year = ? ,",
      "updated_at = ? ",
      "where id = ?",
    ]);

    let values = [req.model, req.model_year, date, req.id];

    return await pool.query(query, values);
  };

  static delete = async (id: number) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query =
      "update tok_vehicle_models set status = 0, updated_at = ? where id = ?";

    return await pool.query(query, [date, id]);
  };

  static list = async (req: any) => {
    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];

    const recordStatus = 1;

    const orderColumns = [
      "id",
      "model",
      "model_year",
      "created_at",
      "updated_at",
    ];

    const orderDirections = ["asc", "desc"];

    if (req.searchstring != "") {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select * from tok_vehicle_models",
          "where (model like ? or model_year = ?)",
          "and status = ? order by ? ? limit ? , ?",
        ]),
        [
          "?",
          "?",
          recordStatus,
          orderColumns[req.order],
          orderDirections[req.dir],
          req.offset,
          req.limit,
        ]
      );

      counterQuery = MysqlUtility.mergeLines([
        "select count(id) as totalRows from tok_vehicle_models",
        "where (model like ? or model_year = ?)",
        "and status = ?",
      ]);

      values = ["%" + req.searchstring + "%", req.searchstring];

      counterQueryValues = [
        "%" + req.searchstring + "%",
        req.searchstring,
        recordStatus,
      ];
    } else {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select * from tok_vehicle_models",
          "where status = ? order by ? ? limit ? , ?",
        ]),
        [
          "?",
          orderColumns[req.order],
          orderDirections[req.dir],
          req.offset,
          req.limit,
        ]
      );

      counterQuery = MysqlUtility.mergeLines([
        "select count(id) as totalRows from tok_vehicle_models",
        "where status = ?",
      ]);

      counterQueryValues = [recordStatus];

      values = [recordStatus];
    }

    const totalRows = await pool.query(counterQuery, counterQueryValues);
    const resultSet = await pool.query(query, values);
    const totalFiltered = resultSet.length;

    return {
      totalRows: totalRows[0].totalRows,
      totalFiltered: totalFiltered,
      resultSet: resultSet,
    };
  };
}
