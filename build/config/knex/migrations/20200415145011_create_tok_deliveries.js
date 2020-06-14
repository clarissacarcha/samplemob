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
        return knex.schema.createTable("tok_deliveries", (table) => {
            table.increments();
            table.string("description", 150).nullable;
            table.string("notes", 150).nullable;
            table.decimal("distance", 10, 2);
            table.integer("duration", 5);
            table.specificType("price", "double");
            table.specificType("rating", "tinyint(1)");
            table.text("cargo");
            /**
             * 1 - Order Placed
             * 2 - Delivery Scheduled
             * 3 - Driver In Transit to Pick Up
             * 4 - Item picked up
             * 5 - Driver in Transit to Deliver
             * 6 - Item delivered
             * 7 - Order Cancelled
             * 8 - Order Deleted
             * 9 - Order Expired
             */
            table.specificType("status", "tinyint(1)");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table
                .integer("tok_consumer_id")
                .unsigned()
                .references("id")
                .inTable("tok_consumers");
            table
                .integer("tok_vehicle_id")
                .unsigned()
                .references("id")
                .inTable("tok_vehicles");
            table
                .integer("tok_driver_id")
                .unsigned()
                .references("id")
                .inTable("tok_drivers");
            table
                .integer("sender_tok_stop_id")
                .unsigned()
                .references("id")
                .inTable("tok_stops");
            table
                .integer("recipient_tok_stop_id")
                .unsigned()
                .references("id")
                .inTable("tok_stops");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("tok_deliveries");
    });
}
exports.down = down;
