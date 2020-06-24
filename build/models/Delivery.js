"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const objection_1 = require("objection");
const Stop_1 = __importDefault(require("./Stop"));
const DeliveryLog_1 = __importDefault(require("./DeliveryLog"));
class default_1 extends objection_1.Model {
}
exports.default = default_1;
default_1.tableName = "tok_deliveries";
default_1.idColumn = "id";
default_1.relationMappings = {
    senderStop: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: Stop_1.default,
        join: {
            from: "tok_deliveries.senderTokStopId",
            to: "tok_stops.id",
        },
    },
    recipientStop: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: Stop_1.default,
        join: {
            from: "tok_deliveries.recipientTokStopId",
            to: "tok_stops.id",
        },
    },
    logs: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: DeliveryLog_1.default,
        join: {
            from: "tok_deliveries.id",
            to: "tok_delivery_logs.tokDeliveryId",
        },
    },
};
default_1.afterInsert = (args) => {
    console.log("DELIVERY HAS BEEN MADE");
};
/**
 * status
 * 0 - Cancelled
 * 1 - Order Placed
 * 2 - Delivery Scheduled
 * 3 - Driver on the Way to Sender
 * 4 - Item Picked Up
 * 5 - Driver on the Way to Recipient
 * 6 - Completed
 * 7 - Cancelled
 * 8 - Expired
 */
