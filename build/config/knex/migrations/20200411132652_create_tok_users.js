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
        return knex.schema.createTable("tok_users", (table) => {
            table.increments();
            table.string("username", 45).notNullable();
            table.string("password", 100).notNullable();
            table.text("access");
            table.text("functions");
            table.string("device_type", 1);
            table.string("device_id", 100);
            table.dateTime("last_seen").nullable();
            table.boolean("active").defaultTo(true);
            table.specificType("failed_login_attempts", "tinyint(1)");
            /**
             * 1 - Active
             * 2 - Applicant
             * 3 - Blocked
             */
            table.specificType("status", "tinyint(1)").notNullable();
            table.timestamp("created").defaultTo(knex.fn.now());
            table.timestamp("updated").defaultTo(knex.fn.now());
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_users");
    });
}
exports.down = down;
