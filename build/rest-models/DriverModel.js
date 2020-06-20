"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverModel = void 0;
const pool = require('../mysql');
const dateFormat = require('dateformat');
const MysqlUtility_1 = require("../util/MysqlUtility");
const AddressModel_1 = require("./AddressModel");
class DriverModel {
}
exports.DriverModel = DriverModel;
DriverModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    //insert to tok_users table
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    //insert to tok_persons table
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
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
    return yield pool.query(query, values);
});
DriverModel.getGeneralInfo = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select tok_users_id from tok_auth_tokens where token = ? ";
    const userId = yield pool.query(query, [token]);
    let queryPerson = MysqlUtility_1.MysqlUtility.mergeLines([
        "select first_name, middle_name, last_name,",
        "mobile_number, email_address, birthdate, gender, avatar, tok_address_id ",
        "from tok_persons where tok_user_id = ?"
    ]);
    const personData = yield pool.query(queryPerson, [userId[0].tok_users_id]);
    let queryAddress = MysqlUtility_1.MysqlUtility.mergeLines([
        "select first_name, middle_name, last_name,",
        "mobile_number, email_address, birthdate, gender, avatar, tok_address_id ",
        "from tok_persons where tok_user_id = ?"
    ]);
    const addressData = yield AddressModel_1.AddressModel.read(personData[0].tok_address_id);
    let queryUsername = "select username from tok_users where id = ?";
    const usernameData = yield pool.query(queryUsername, [userId[0].tok_users_id]);
    return {
        personData: personData[0],
        addressData: addressData[0],
        usernameData: usernameData[0]
    };
});
DriverModel.getDeliveryHistory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let queryDriver = "select id from tok_drivers where tok_user_id = ?";
    let driverData = yield pool.query(queryDriver, [req.userId]);
    let queryDeliveries = "select id, description, created_at as date from tok_deliveries where tok_driver_id = ?";
    let deliveriesData = yield pool.query(queryDeliveries, [driverData[0].id]);
    let driverDeliveriesIds = [];
    // extract just the driver delivery ids
    for (let a = 0; a < deliveriesData.length; a++) {
        driverDeliveriesIds.push(deliveriesData[a].id);
    }
    let queryDeliveryLogs = "select tok_delivery_id from tok_delivery_logs where tok_delivery_id in (" + driverDeliveriesIds + ")";
    let deliveryLogsData = yield pool.query(queryDeliveryLogs);
    driverDeliveriesIds = [];
    for (let a = 0; a < deliveryLogsData.length; a++) {
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
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select id, description, DATE_FORMAT(created_at,'%d/%m/%Y') as date from tok_deliveries where id in (" + driverDeliveriesIds + ")",
            "and status = ? order by ? ? limit ? , ?",
        ]), [
            recordStatus,
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_deliveries where id in (" + driverDeliveriesIds + ")",
            "and status = ?",
        ]);
        values = [];
        counterQueryValues = [
            recordStatus,
        ];
    }
    else {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select id, description, DATE_FORMAT(created_at,'%d/%m/%Y') as date from tok_deliveries where id in (" + driverDeliveriesIds + ")",
            "and status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_deliveries where id in (" + driverDeliveriesIds + ")",
            "and status = ?",
        ]);
        counterQueryValues = [recordStatus];
        values = [recordStatus];
    }
    const totalRows = yield pool.query(counterQuery, counterQueryValues);
    const resultSet = yield pool.query(query, values);
    const totalFiltered = resultSet.length;
    return {
        totalRows: totalRows[0].totalRows,
        totalFiltered: totalFiltered,
        resultSet: resultSet,
    };
});
