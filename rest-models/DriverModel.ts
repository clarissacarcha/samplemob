const pool = require('../mysql');
const dateFormat = require('dateformat');
import { MysqlUtility } from '../util/MysqlUtility';
import { AuthUtility } from '../util/AuthUtility';
import { AddressModel } from './AddressModel';



export class DriverModel{

  static create = async(req:any) => {

  	//insert to tok_users table
  	const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //insert to tok_persons table
    let query = MysqlUtility.mergeLines([
          "insert into tok_drivers",
          "(license_number,rating,status,is_online,created_at,updated_at,tok_user_id,tok_account_level_id)",
          "values(?,?,?,?,?,?,?,?)"
        ]);

     let values = [
       req.license_number,
       0,
       2,
       1,
       date,
       date,
       req.userId,
       null
     ];

     return await pool.query(query,values);

  }

  static getGeneralInfo = async (token: string) => {

    let query = "select tok_users_id from tok_auth_tokens where token = ? ";

    const userId = await pool.query(query,[token]);

    let queryPerson =  MysqlUtility.mergeLines([
        "select first_name, middle_name, last_name,",
        "mobile_number, email_address, birthdate, gender, avatar, tok_address_id ",
        "from tok_persons where tok_user_id = ?"
      ]);

    const personData = await pool.query(queryPerson,[userId[0].tok_users_id]);

    let queryAddress =  MysqlUtility.mergeLines([
        "select first_name, middle_name, last_name,",
        "mobile_number, email_address, birthdate, gender, avatar, tok_address_id ",
        "from tok_persons where tok_user_id = ?"
      ]);

    const addressData = await AddressModel.read(personData[0].tok_address_id);

    let queryUsername = "select username from tok_users where id = ?" ;

    const usernameData = await pool.query(queryUsername,[userId[0].tok_users_id]);

    return {
      personData: personData[0],
      addressData: addressData[0],
      usernameData: usernameData[0]
    };

  };

  static getDeliveryHistory = async (req: any) => {

    let queryDriver = "select id from tok_drivers where tok_user_id = ?";

    let driverData =  await pool.query(queryDriver, [req.userId]);

    let queryDeliveries = "select id, description, created_at as date from tok_deliveries where tok_driver_id = ?";

    let deliveriesData = await pool.query(queryDeliveries, [driverData[0].id]);

    let driverDeliveriesIds = [];

    // extract just the driver delivery ids
    for(let a = 0; a< deliveriesData.length; a++)
    {
      driverDeliveriesIds.push(deliveriesData[a].id);
    }

    let queryDeliveryLogs = "select tok_delivery_id from tok_delivery_logs where tok_delivery_id in ("+driverDeliveriesIds+")";

    let deliveryLogsData = await pool.query(queryDeliveryLogs);

    driverDeliveriesIds = [];

    for(let a = 0; a< deliveryLogsData.length; a++)
    {
      driverDeliveriesIds.push(deliveryLogsData[a].tok_delivery_id);
    }

    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];

    const recordStatus = 1;

    const orderColumns = [
      "id",
      "description",
      "created_at",
    ];

    const orderDirections = ["asc", "desc"];

    if (req.searchstring != "") {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select id, description, DATE_FORMAT(created_at,'%d/%m/%Y') as date from tok_deliveries where id in ("+driverDeliveriesIds+")",
          "and status = ? order by ? ? limit ? , ?",
        ]),
        [
          recordStatus,
          orderColumns[req.order],
          orderDirections[req.dir],
          req.offset,
          req.limit,
        ]
      );

      counterQuery = MysqlUtility.mergeLines([
        "select count(id) as totalRows from tok_deliveries where id in ("+driverDeliveriesIds+")",
        "and status = ?",
      ]);

      values = [];

      counterQueryValues = [
        recordStatus,
      ];
    } else {
      query = MysqlUtility.bindValues(
        MysqlUtility.mergeLines([
          "select id, description, DATE_FORMAT(created_at,'%d/%m/%Y') as date from tok_deliveries where id in ("+driverDeliveriesIds+")",
          "and status = ? order by ? ? limit ? , ?",
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
        "select count(id) as totalRows from tok_deliveries where id in ("+driverDeliveriesIds+")",
        "and status = ?",
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
