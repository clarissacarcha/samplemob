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
exports.AddressModel = void 0;
const pool = require("../mysql");
const dateFormat = require("dateformat");
const MysqlUtility_1 = require("../util/MysqlUtility");
class AddressModel {
}
exports.AddressModel = AddressModel;
AddressModel.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "insert into tok_addresses",
        "(line1,line2, barangay,city,province,country,postal)",
        "values(?,?,?,?,?,?,?)",
    ]);
    let values = [
        req.line_1,
        req.line_2,
        req.barangay,
        req.city,
        req.province,
        req.country,
        req.postal_code,
    ];
    let addressResult = yield pool.query(query, values);
    return addressResult.insertId;
});
AddressModel.read = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "select * from tok_addresses where id = ?";
    return yield pool.query(query, [id]);
});
AddressModel.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = MysqlUtility_1.MysqlUtility.mergeLines([
        "update tok_addresses set",
        "line1 = ? ,",
        "line2 = ? ,",
        "barangay = ? ,",
        "city = ?,",
        "province = ? ",
        "country = ? ",
        "postal = ?",
        "where id = ?",
    ]);
    let values = [
        req.line_1,
        req.line_2,
        req.barangay,
        req.city,
        req.province,
        req.country,
        req.postal_code,
        req.id,
    ];
    return yield pool.query(query, values);
});
