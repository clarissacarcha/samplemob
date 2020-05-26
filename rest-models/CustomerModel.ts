const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';
import { AuthUtility } from '../util/AuthUtility';


export class CustomerModel{

  static create = async(req:any) => {

  	//insert to tok_users table
  	const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //insert to tok_consumers table
    let query = MysqlUtility.mergeLines([
      "insert into tok_consumers",
      "(rating,status,created_at,updated_at,tok_user_id)",
      "values(?,?,?,?,?)"
    ]);

    let values = [
      5,
      1,
      date,
      date,
      req.userId
    ];

    return await pool.query(query,values);

  }



}
