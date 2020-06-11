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
class VehicleTypeModel {
}
exports.VehicleTypeModel = VehicleTypeModel;
VehicleTypeModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "insert into tok_vehicle_types",
        "(type,seats, cargo_capacity,cargo_unit,status,created_at,updated_at)",
        "values(?,?,?,?,?,?,?)",
    ]);
    let values = [
        req.type,
        req.seats,
        req.cargo_capacity,
        req.cargo_unit,
        1,
        date,
        date,
    ];
    return yield pool.query(query, values);
});
VehicleTypeModel.read = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select * from tok_vehicle_types where id = ?";
    return yield pool.query(query, [id]);
});
VehicleTypeModel.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "update tok_vehicle_types set",
        "type = ? ,",
        "seats = ? ,",
        "cargo_capacity = ? ,",
        "cargo_unit = ?,",
        "updated_at = ? ",
        "where id = ?",
    ]);
    let values = [
        req.type,
        req.seats,
        req.cargo_capacity,
        req.cargo_unit,
        date,
        req.id,
    ];
    return yield pool.query(query, values);
});
VehicleTypeModel.delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let query = "update tok_vehicle_types set status = 0, updated_at = ? where id = ?";
    return yield pool.query(query, [date, id]);
});
VehicleTypeModel.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "";
    let values = [];
    let counterQuery = "";
    let counterQueryValues = [];
    const recordStatus = 1;
    const orderColumns = [
        "id",
        "type",
        "seats",
        "cargo_capacity",
        "cargo_unit",
        "created_at",
        "updated_at",
    ];
    const orderDirections = ["asc", "desc"];
    if (req.searchstring != "") {
        query = MysqlUtility_1.MysqlUtility.bindValues(MysqlUtility_1.MysqlUtility.mergeLines([
            "select * from tok_vehicle_types",
            "where (type like ? or seats = ? or cargo_capacity = ? or cargo_unit like ?)",
            "and status = ? order by ? ? limit ? , ?",
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
            "select count(id) as totalRows from tok_vehicle_types",
            "where (type like ? or seats = ? or cargo_capacity = ? or cargo_unit like ?)",
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
            "select * from tok_vehicle_types",
            "where status = ? order by ? ? limit ? , ?",
        ]), [
            "?",
            orderColumns[req.order],
            orderDirections[req.dir],
            req.offset,
            req.limit,
        ]);
        counterQuery = MysqlUtility_1.MysqlUtility.mergeLines([
            "select count(id) as totalRows from tok_vehicle_types",
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
        resultSet: resultSet,
    };
});
