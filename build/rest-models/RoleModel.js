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
exports.RoleModel = void 0;
const pool = require("../mysql");
const dateFormat = require("dateformat");
const MysqlUtility_1 = require("../util/MysqlUtility");
class RoleModel {
}
exports.RoleModel = RoleModel;
RoleModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "insert into tok_roles",
        "(role,status,created)",
        "values(?,?,?)",
    ]);
    let values = [
        req.role,
        1,
        date
    ];
    return yield pool.query(query, values);
});
RoleModel.read = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select * from tok_roles where id = ?";
    return yield pool.query(query, [id]);
});
RoleModel.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "update tok_roles set",
        "role = ? ,",
        "updated = ? ",
        "where id = ?",
    ]);
    let values = [
        req.role,
        date,
        req.id,
    ];
    return yield pool.query(query, values);
});
RoleModel.delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = "update tok_roles set status = 0, updated = ? where id = ?";
    return yield pool.query(query, [date, id]);
});
RoleModel.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];
    const recordStatus = 1;
    const orderColumns = [
        "id",
        "role",
        "created_at",
        "updated_at",
    ];
    const orderDirections = ["asc", "desc"];
    if (req.searchstring != "") {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select * from tok_roles",
            "where role like ?",
            "and status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            recordStatus,
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_roles",
            "where role like ?",
            "and status = ?",
        ]);
        values = [
            "%" + req.searchstring + "%"
        ];
        counterQueryValues = [
            "%" + req.searchstring + "%",
            recordStatus,
        ];
    }
    else {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select * from tok_roles",
            "where status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_roles",
            "where status = ?",
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
        resultSet: resultSet
    };
});
