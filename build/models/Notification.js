"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const objection_1 = require("objection");
const Delivery_1 = __importDefault(require("./Delivery"));
class default_1 extends objection_1.Model {
}
exports.default = default_1;
default_1.tableName = "tok_notifications";
default_1.idColumn = "id";
default_1.relationMappings = {
    delivery: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: Delivery_1.default,
        join: {
            from: "tok_notifications.tokDeliveryId",
            to: "tok_deliveries.id",
        },
    },
};
