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
exports.UserModel = void 0;
const pool = require('../mysql');
const dateFormat = require('dateformat');
const MysqlUtility_1 = require("../util/MysqlUtility");
const AuthUtility_1 = require("../util/AuthUtility");
class UserModel {
}
exports.UserModel = UserModel;
UserModel.readFromUserName = (username) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select a.*, concat(b.first_name,' ',b.middle_name, ' ', b.last_name) as name, b.avatar",
        "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
        "where username = ?"
    ]);
    return yield pool.query(query, [username]);
});
UserModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    //insert to tok_users table
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "insert into tok_users",
        "(username,password,access,active,failed_login_attempts,status,created,updated)",
        "values(?,?,?,?,?,?,?,?)"
    ]);
    const passwordHash = AuthUtility_1.AuthUtility.generateHash(req.password);
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
    let userResult = yield pool.query(query, values);
    return userResult.insertId;
});
UserModel.getUserRoles = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select a.id, b.role from tok_user_roles as a",
        "left join tok_roles as b on a.tok_roles_id = b.id",
        "where a.tok_users_id = ?"
    ]);
    let userRolesResult = yield pool.query(query, [userId]);
    let userRoleCodes = [];
    // extract just the role codes
    for (let a = 0; a < userRolesResult.length; a++) {
        userRoleCodes.push(userRolesResult[a].role);
    }
    return userRoleCodes;
});
UserModel.getUserPermissions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select a.id, b.permission_code from tok_user_permissions as a",
        "left join tok_permissions as b on a.tok_permissions_id = b.id",
        "where a.tok_users_id = ?"
    ]);
    let userPermissionResult = yield pool.query(query, [userId]);
    let userPermissionCodes = [];
    // extract just the role codes
    for (let a = 0; a < userPermissionResult.length; a++) {
        userPermissionCodes.push(userPermissionResult[a].permission_code);
    }
    return userPermissionCodes;
});
