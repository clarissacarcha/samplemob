const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';
import { AuthUtility } from '../util/AuthUtility';


export class UserModel{

  static readFromUserName = async(username:string) => {


    let query = MysqlUtility.mergeLines([
        "select a.*, concat(b.first_name,' ',b.middle_name, ' ', b.last_name) as name, b.avatar",
        "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
        "where username = ?"
    ]);

    return await pool.query(query,[username]);
    
  }

  static create = async(req:any) => {

  	//insert to tok_users table
  	const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
        "insert into tok_users",
        "(username,password,access,active,failed_login_attempts,status,created,updated)",
        "values(?,?,?,?,?,?,?,?)"
    ]);

    const passwordHash = AuthUtility.generateHash(req.password);

    let values = [
       req.email,
       passwordHash,
       "access",
       1,
       0,
       1,
       date,
       date
    ];

    let userResult = await pool.query(query,values);
    
  	return userResult.insertId;

  }


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
        "select a.id, b.permission_code from tok_user_permissions as a",
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


}
