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
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable("tok_user_wallet_logs", (table) => {
            table.increments();
            table
                .integer("tok_wallet_id")
                .unsigned()
                .references("id")
                .inTable("tok_user_wallet");
            table.string("type", 45).notNullable();
            table.specificType("balance", "double");
            table.timestamp("transaction_date").defaultTo(knex.fn.now());
            table.specificType("incoming", "double");
            table.specificType("outgoing", "double");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_user_wallet_logs");
    });
}
exports.down = down;
