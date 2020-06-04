const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';

require("dotenv").config();

export class AuthTokenModel{

  static create = async(token:any, userId: string, roles:any, permissions: any) => {

    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = MysqlUtility.mergeLines([
        "insert into tok_auth_tokens",
        "(token,tok_users_id, roles, permissions, created_at,last_activity)",
        "values(?,?,?,?,?,?)"
    ]);

    let values = [
       token,
       userId,
       roles,
       permissions,
       date,
       date
    ];

    return await pool.query(query,values);
    
  }

  static verifyLogin = async(token:string) => {

    let dt = new Date();
    dt.setMinutes( dt.getMinutes() - 30 ); // 30 minutes

    let mysqlDateFormat = dateFormat(dt, "yyyy-mm-dd HH:MM:ss");

    let query = "select * from tok_auth_tokens where token = ? and last_activity > ?";

    const result = await pool.query(query,[token,mysqlDateFormat]);

    if(result.length > 0)
    {
      
      let query = "update tok_auth_tokens set last_activity = ? where token = ?";
      pool.query(query,[dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),token]);

      return true;
    }
    else
    {
      return false;
    }

  }

}

