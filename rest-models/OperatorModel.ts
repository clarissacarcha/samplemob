const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';
import { AuthUtility } from '../util/AuthUtility';


export class OperatorModel{

  static create = async(req:any) => {

  	//insert to tok_users table
  	const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //insert to tok_operators table
    let query = MysqlUtility.mergeLines([
      "insert into tok_operators",
      "(operator_name,permit_number,status,created_at,updated_at,tok_user_id)",
      "values(?,?,?,?,?,?)"
    ]);

    let values = [
      'TOBEFILLED',
      'TOBEFILLED',
      0,
      date,
      date,
      req.userId
    ];

    return await pool.query(query,values);
  }



}
