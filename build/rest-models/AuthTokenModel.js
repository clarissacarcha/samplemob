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
exports.AuthTokenModel = void 0;
const pool = require('../mysql');
const dateFormat = require('dateformat');
const MysqlUtility_1 = require("../util/MysqlUtility");
require("dotenv").config();
class AuthTokenModel {
}
exports.AuthTokenModel = AuthTokenModel;
AuthTokenModel.create = (token, userId, roles, permissions) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
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
    return yield pool.query(query, values);
});
AuthTokenModel.verifyLogin = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let dt = new Date();
    dt.setMinutes(dt.getMinutes() - 30); // 30 minutes
    let mysqlDateFormat = dateFormat(dt, "yyyy-mm-dd HH:MM:ss");
    let query = "select * from tok_auth_tokens where token = ? and last_activity > ?";
    const result = yield pool.query(query, [token, mysqlDateFormat]);
    if (result.length > 0) {
        let query = "update tok_auth_tokens set last_activity = ? where token = ?";
        pool.query(query, [dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"), token]);
        return true;
    }
    else {
        return false;
    }
});
AuthTokenModel.getUserId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select tok_users_id from tok_auth_tokens where token = ?";
    const result = yield pool.query(query, [token]);
    return result[0].tok_users_id;
});
