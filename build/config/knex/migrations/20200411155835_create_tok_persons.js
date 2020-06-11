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
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable("tok_persons", (table) => {
            table.increments();
            table.string("first_name", 45);
            table.string("middle_name", 45);
            table.string("last_name", 45);
            table.string("mobile_number", 15);
            table.string("email_address", 100);
            table.date("birthdate");
            table.specificType("gender", "tinyint(1)");
            table.string("avatar", 45);
            table.specificType("status", "tinyint(1)");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table
                .integer("tok_user_id")
                .unsigned()
                .references("id")
                .inTable("tok_users");
            table
                .integer("tok_address_id")
                .unsigned()
                .references("id")
                .inTable("tok_addresses");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_persons");
    });
}
exports.down = down;
