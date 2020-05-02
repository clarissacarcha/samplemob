const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';

export class UserModel{

  static readFromUserName = async(username:string) => {

    let query = "select * from tok_users where  username = ?";

    return await pool.query(query,[username]);
    
  }

}
