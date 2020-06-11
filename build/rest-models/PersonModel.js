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
const pool = require('../mysql');
const dateFormat = require('dateformat');
const MysqlUtility_1 = require("../util/MysqlUtility");
class PersonModel {
}
exports.PersonModel = PersonModel;
PersonModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    //insert to tok_users table
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    //insert to tok_persons table
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "insert into tok_persons",
        "(first_name,middle_name,last_name,email_address,status,created_at,updated_at,tok_user_id)",
        "values(?,?,?,?,?,?,?,?)"
    ]);
    let values = [
        req.firstName,
        req.middleName,
        req.lastName,
        req.email,
        1,
        date,
        date,
        req.userId
    ];
    pool.query(query, values);
});
