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
        return knex.schema.createTable("tok_trips", (table) => {
            table.increments();
            table.string("description", 150).nullable;
            table.string("notes", 150).nullable;
            table.dateTime("book_time").defaultTo(knex.fn.now());
            table.dateTime("pickup_time").defaultTo(knex.fn.now());
            table.dateTime("drop_off_time").defaultTo(knex.fn.now());
            table.string("pickup_location", 45).notNullable;
            table.string("destination", 45).notNullable;
            table.string("contact_number", 20).notNullable;
            table.specificType("distance_km", "int(10)").notNullable;
            table.specificType("price", "double");
            table.specificType("rating", "tinyint(1)");
            table.specificType("status", "tinyint(1)");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.integer("tok_consumer_id").unsigned().references("id").inTable("tok_consumers");
            table.integer("tok_vehicle_id").unsigned().references("id").inTable("tok_vehicles");
            table.integer("tok_driver_id").unsigned().references("id").inTable("tok_drivers");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_trips");
    });
}
exports.down = down;
