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
const pool = require("../mysql");
const dateFormat = require("dateformat");
const MysqlUtility_1 = require("../util/MysqlUtility");
class AccountLevelModel {
}
exports.AccountLevelModel = AccountLevelModel;
AccountLevelModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "insert into tok_account_levels",
        "(account_level,level_name, priority,tok_account_level_type_id,status,created_at)",
        "values(?,?,?,?,?,?)",
    ]);
    let values = [
        req.account_level,
        req.level_name,
        req.priority,
        req.tok_account_level_type_id,
        1,
        date,
    ];
    return yield pool.query(query, values);
});
AccountLevelModel.read = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select * from tok_account_levels where id = ?";
    return yield pool.query(query, [id]);
});
AccountLevelModel.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "update tok_account_levels set",
        "account_level = ? ,",
        "level_name = ? ,",
        "priority = ? ,",
        "tok_account_level_type_id = ?,",
        "updated_at = ? ",
        "where id = ?",
    ]);
    let values = [
        req.account_level,
        req.level_name,
        req.priority,
        req.tok_account_level_type_id,
        date,
        req.id,
    ];
    return yield pool.query(query, values);
});
AccountLevelModel.delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = "update tok_account_levels set status = 0, updated_at = ? where id = ?";
    return yield pool.query(query, [date, id]);
});
AccountLevelModel.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];
    const recordStatus = 1;
    const orderColumns = [
        "id",
        "account_level",
        "level_name",
        "priority",
        "tok_account_level_type_id",
        "created_at",
        "updated_at",
    ];
    const orderDirections = ["asc", "desc"];
    if (req.searchstring != "") {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select a.*, b.type ,b.status as account_level_type_status from tok_account_levels as a ",
            "left join tok_account_level_types as b on a.tok_account_level_type_id = b.id",
            "where (a.account_level like ? or a.level_name = ? or a.priority = ? or a.tok_account_level_type_id like ?)",
            "and a.status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            "?",
            "?",
            "?",
            recordStatus,
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_account_levels",
            "where (account_level like ? or level_name = ? or priority = ? or tok_account_level_type_id like ?)",
            "and status = ?",
        ]);
        values = [
            "%" + req.searchstring + "%",
            req.searchstring,
            req.searchstring,
            "%" + req.searchstring + "%",
        ];
        counterQueryValues = [
            "%" + req.searchstring + "%",
            req.searchstring,
            req.searchstring,
            "%" + req.searchstring + "%",
            recordStatus,
        ];
    }
    else {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select a.*, b.type ,b.status as account_level_type_status from tok_account_levels as a ",
            "left join tok_account_level_types as b on a.tok_account_level_type_id = b.id",
            "where a.status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_account_levels",
            "where status = ?",
        ]);
        counterQueryValues = [recordStatus];
        values = [recordStatus];
    }
    const totalRows = yield pool.query(counterQuery, counterQueryValues);
    const resultSet = yield pool.query(query, values);
    const totalFiltered = resultSet.length;
    const account_level_types = yield AccountLevelModel.getAccountLevelTypes();
    return {
        totalRows: totalRows[0].totalRows,
        totalFiltered: totalFiltered,
        resultSet: resultSet,
        account_level_types: account_level_types
    };
});
AccountLevelModel.getAccountLevelTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select * from tok_account_level_types where status = 1 ";
    return yield pool.query(query);
});
