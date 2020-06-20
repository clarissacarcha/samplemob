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
        return knex.schema.createTable("tok_messages", (table) => {
            table.increments();
            table.string("title", 255).notNullable; // Maximum 120 characters to not be truncated
            table.text("body").notNullable;
            /**
             * 1 - Unread
             * 2 - Read
             */
            table.specificType("status", "tinyint(1)");
            table.dateTime("created_at").defaultTo(knex.fn.now());
            table
                .integer("tok_user_id")
                .unsigned()
                .references("id")
                .inTable("tok_users");
            table
                .integer("tok_delivery_id")
                .unsigned()
                .references("id")
                .inTable("tok_deliveries");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_messages");
    });
}
exports.down = down;
