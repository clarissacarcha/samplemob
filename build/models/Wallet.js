"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const objection_1 = require("objection");
const WalletLog_1 = __importDefault(require("./WalletLog"));
class default_1 extends objection_1.Model {
}
exports.default = default_1;
default_1.tableName = "tok_user_wallet";
default_1.idColumn = "id";
default_1.relationMappings = {
    walletLog: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: WalletLog_1.default,
        join: {
            from: "tok_user_wallet.id",
            to: "tok_user_wallet_logs.tok_wallet_id",
        },
    },
};
