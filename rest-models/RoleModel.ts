const pool = require("../mysql");
const dateFormat = require("dateformat");
import { MysqlUtility } from "../util/MysqlUtility";

export class RoleModel {
  static create = async (req: any) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
      "insert into tok_roles",
      "(role,status,created)",
      "values(?,?,?)",
    ]);

    let values = [
      req.role,
      1,
      date
    ];

    return await pool.query(query, values);
  };

  static read = async (id: number) => {
    let query = "select * from tok_roles where id = ?";

    return await pool.query(query, [id]);
  };

  static update = async (req: any) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
      "update tok_roles set",
      "role = ? ,",
      "updated = ? ",
      "where id = ?",
    ]);

    let values = [
      req.role,
      date,
      req.id,
    ];

    return await pool.query(query, values);
  };

  static delete = async (id: number) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query =
      "update tok_roles set status = 0, updated = ? where id = ?";

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
      "role",
      "created_at",
      "updated_at",
    ];

    const orderDirections = ["asc", "desc"];

    if (req.searchstring != "") {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select * from tok_roles",
          "where role like ?",
          "and status = ? order by ? ? limit ? , ?",
        ]),
        [
          "?",
          recordStatus,
          orderColumns[req.order],
          orderDirections[req.dir],
          req.offset,
          req.limit,
        ]
      );

      counterQuery = MysqlUtility.mergeLines([
        "select count(id) as totalRows from tok_roles",
        "where role like ?",
        "and status = ?",
      ]);

      values = [
        "%" + req.searchstring + "%"
      ];

      counterQueryValues = [
        "%" + req.searchstring + "%",
        recordStatus,
      ];
    } else {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select * from tok_roles",
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
        "select count(id) as totalRows from tok_roles",
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
      resultSet: resultSet
    };
  };
}
