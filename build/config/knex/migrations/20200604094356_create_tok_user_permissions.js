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
        return knex.schema.createTable("tok_user_permissions", (table) => {
            table.increments();
            table
                .integer("tok_users_id")
                .unsigned()
                .references("id")
                .inTable("tok_users");
            table
                .integer("tok_permissions_id")
                .unsigned()
                .references("id")
                .inTable("tok_permissions");
            table.specificType("status", "tinyint(1)");
            table.timestamp("created").defaultTo(knex.fn.now());
            table.timestamp("updated").defaultTo(knex.fn.now());
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_user_permissions");
    });
}
exports.down = down;
