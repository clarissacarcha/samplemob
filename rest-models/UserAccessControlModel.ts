const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';
import { AuthUtility } from '../util/AuthUtility';


export class UserAccessControlModel{

static update = async (req: any) => {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
      "update tok_vehicle_brands set",
      "brand = ? ,",
      "updated_at = ? ",
      "where id = ?",
    ]);

    let values = [
      req.brand,
      date,
      req.id,
    ];

    return await pool.query(query, values);
  };

static getUserRoles = async(userId:string) => {

    let query = MysqlUtility.mergeLines([
        "select a.id, b.role from tok_user_roles as a",
        "left join tok_roles as b on a.role = b.id",
        "where a.tok_users_id = ?"
    ]);

    let userRolesResult = await pool.query(query,[userId]);
    let userRoleCodes = [];

    // extract just the role codes
    for(let a = 0; a< userRolesResult.length; a++)
    {
      userRoleCodes.push(userRolesResult[a].role);
    }
    return userRoleCodes;

  }
static getUserPermissions = async(userId:string) => {

    let query = MysqlUtility.mergeLines([
        "select a.id, b.permission_code, b.desription from tok_user_permissions as a",
        "left join tok_permissions as b on a.tok_permissions_id = b.id",
        "where a.tok_users_id = ?"
    ]);

    let userPermissionResult = await pool.query(query,[userId]);
    let userPermissionCodes = [];

    // extract just the role codes
    for(let a = 0; a< userPermissionResult.length; a++)
    {
      userPermissionCodes.push(userPermissionResult[a].permission_code);
    }

    return userPermissionCodes;

  }

static list = async (req: any) => {
    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];
    let useraccesscontrol = [];


    const recordStatus = 1;

    const orderColumns = [
      "id",
      "username",
      "fullname",
    ];

    const orderDirections = ["asc", "desc"];

    if (req.searchstring != "") {
      query = MysqlUtility.mergeLines([
        "select a.id, a.username, concat(b.first_name,' ',b.middle_name, ' ', b.last_name) as fullname",
        "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
        "where (a.username like ? or fullname like ? )",
        "and a.status = ? order by ? ? limit ? , ?",
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
      counterQuery = MysqlUtility.mergeLines([
        "select count(a.id) as totalRows",
        "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
        "where (a.username like ? or fullname like ? )",
        "and a.status = ? ",
      ]);

      values = [
        "%" + req.searchstring + "%",
        "%" + req.searchstring + "%",
      ];

      counterQueryValues = [
        "%" + req.searchstring + "%",
        "%" + req.searchstring + "%",
        recordStatus,
      ];
    } else {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select a.id, a.username, concat(b.first_name,' ',b.middle_name, ' ', b.last_name) as fullname",
          "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
          "where a.status = ? order by ? ? limit ? , ?",
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
        "select count(a.id) as totalRows",
        "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
        "where a.status = ?",
      ]);

      counterQueryValues = [recordStatus];

      values = [recordStatus];
    }

    const totalRows = await pool.query(counterQuery, counterQueryValues);
    const resultSet = await pool.query(query, values);
    const totalFiltered = resultSet.length;
    let user1 = {};

    for(let a = 0; a< resultSet.length; a++)
    {
      const roles = await UserAccessControlModel.getUserRoles(resultSet[a].id);
      const permissions = await UserAccessControlModel.getUserPermissions(resultSet[a].id);

      user1 = {
        id:resultSet[a].id,
        username:resultSet[a].username,
        fullname:resultSet[a].fullname, 
        roles: roles,
        permissions: permissions
      };
      useraccesscontrol.push(user1);
    }

    return {
      totalRows: totalRows[0].totalRows,
      totalFiltered: totalFiltered,
      resultSet: useraccesscontrol,
    };
  };
}