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
exports.UserAccessControlModel = void 0;
const pool = require('../mysql');
const dateFormat = require('dateformat');
const MysqlUtility_1 = require("../util/MysqlUtility");
class UserAccessControlModel {
}
exports.UserAccessControlModel = UserAccessControlModel;
UserAccessControlModel.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "update tok_vehicle_brands set",
        "brand = ? ,",
        "updated_at = ? ",
        "where id = ?",
    ]);
    let values = [
        req.brand,
        date,
        req.id,
    ];
    return yield pool.query(query, values);
});
UserAccessControlModel.getUserRoles = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select a.id, b.role from tok_user_roles as a",
        "left join tok_roles as b on a.tok_roles_id = b.id",
        "where a.tok_users_id = ?"
    ]);
    let userRolesResult = yield pool.query(query, [userId]);
    let userRoleCodes = [];
    let userRoleDetails = {};
    // extract just the role codes
    for (let a = 0; a < userRolesResult.length; a++) {
        userRoleDetails = {
            id: userRolesResult[a].id,
            roles: userRolesResult[a].role
        };
        userRoleCodes.push(userRoleDetails);
    }
    return userRoleCodes;
});
UserAccessControlModel.getUserPermissions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select a.id, b.permission_code, b.description from tok_user_permissions as a",
        "left join tok_permissions as b on a.tok_permissions_id = b.id",
        "where a.tok_users_id = ?"
    ]);
    let userPermissionResult = yield pool.query(query, [userId]);
    let userPermissionCodes = [];
    let userPermDescription = {};
    const allpermissions = yield UserAccessControlModel.getAllUserPermissions();
    for (var a = 0; a < allpermissions.length; a++) {
        let perm = userPermissionResult.find((perm) => perm.id === allpermissions[a].id);
        if (perm) {
            userPermDescription = {
                id: allpermissions[a].id,
                permission_desc: allpermissions[a].description,
                permission_code: allpermissions[a].permission_code,
                isChecked: true
            };
        }
        else {
            userPermDescription = {
                id: allpermissions[a].id,
                permission_desc: allpermissions[a].description,
                permission_code: allpermissions[a].permission_code,
                isChecked: false
            };
        }
        userPermissionCodes.push(userPermDescription);
    }
    return userPermissionCodes;
});
UserAccessControlModel.getAllUserRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select id, role from tok_roles"
    ]);
    let userRolesResult = yield pool.query(query);
    let userRoleCodes = [];
    let userRoleDetails = {};
    // extract just the role codes
    for (let a = 0; a < userRolesResult.length; a++) {
        userRoleDetails = {
            id: userRolesResult[a].id,
            role: userRolesResult[a].role
        };
        userRoleCodes.push(userRoleDetails);
    }
    return userRoleCodes;
});
UserAccessControlModel.getAllUserPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "select id, permission_code, description from tok_permissions"
    ]);
    let userPermissionResult = yield pool.query(query);
    let userPermissionCodes = [];
    let userPermDetails = {};
    // extract just the perm codes
    for (let a = 0; a < userPermissionResult.length; a++) {
        userPermDetails = {
            id: userPermissionResult[a].id,
            permission_desc: userPermissionResult[a].description,
            permission_code: userPermissionResult[a].permission_code
        };
        userPermissionCodes.push(userPermDetails);
    }
    return userPermissionResult;
});
UserAccessControlModel.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];
    let useraccesscontrol = [];
    const recordStatus = 1;
    const orderColumns = [
        "id",
        "username",
        "fullname",
    ];
    const orderDirections = ["asc", "desc"];
    if (req.searchstring != "") {
        query = MysqlUtility_1.MysqlUtility.mergeLines([
            "select a.id, a.username, concat(b.first_name,' ',b.middle_name, ' ', b.last_name) as fullname",
            "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
            "where (a.username like ? or fullname like ? )",
            "and a.status = ? order by ? ? limit ? , ?",
        ]),
            [
                "?",
                "?",
                recordStatus,
                orderColumns[req.order],
                orderDirections[req.dir],
                req.offset,
                req.limit,
            ];
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(a.id) as totalRows",
            "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
            "where (a.username like ? or fullname like ? )",
            "and a.status = ? ",
        ]);
        values = [
            "%" + req.searchstring + "%",
            "%" + req.searchstring + "%",
        ];
        counterQueryValues = [
            "%" + req.searchstring + "%",
            "%" + req.searchstring + "%",
            recordStatus,
        ];
    }
    else {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select a.id, a.username, concat(b.first_name,' ',b.middle_name, ' ', b.last_name) as fullname",
            "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
            "where a.status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(a.id) as totalRows",
            "from tok_users as a left join tok_persons as b on a.id = b.tok_user_id",
            "where a.status = ?",
        ]);
        counterQueryValues = [recordStatus];
        values = [recordStatus];
    }
    const totalRows = yield pool.query(counterQuery, counterQueryValues);
    const resultSet = yield pool.query(query, values);
    const totalFiltered = resultSet.length;
    let user1 = {};
    for (let a = 0; a < resultSet.length; a++) {
        const roles = yield UserAccessControlModel.getUserRoles(resultSet[a].id);
        const permissions = yield UserAccessControlModel.getUserPermissions(resultSet[a].id);
        user1 = {
            id: resultSet[a].id,
            username: resultSet[a].username,
            fullname: resultSet[a].fullname,
            roles: roles,
            permissions: permissions
        };
        useraccesscontrol.push(user1);
    }
    const allroles = yield UserAccessControlModel.getAllUserRoles();
    const allpermissions = yield UserAccessControlModel.getAllUserPermissions();
    return {
        totalRows: totalRows[0].totalRows,
        totalFiltered: totalFiltered,
        resultSet: useraccesscontrol,
        permissions: allpermissions,
        roles: allroles
    };
});
