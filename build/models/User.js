"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Consumer_1 = __importDefault(require("./Consumer"));
const Driver_1 = __importDefault(require("./Driver"));
const Person_1 = __importDefault(require("./Person"));
class default_1 extends objection_1.Model {
}
exports.default = default_1;
default_1.tableName = "tok_users";
default_1.idColumn = "id";
default_1.relationMappings = {
    driver: {
        relation: objection_1.Model.HasOneRelation,
        modelClass: Driver_1.default,
        join: {
            from: "tok_users.id",
            to: "tok_drivers.tokUserId",
        },
    },
    person: {
        relation: objection_1.Model.HasOneRelation,
        modelClass: Person_1.default,
        join: {
            from: "tok_users.id",
            to: "tok_persons.tokUserId",
        },
    },
    consumer: {
        relation: objection_1.Model.HasOneRelation,
        modelClass: Consumer_1.default,
        join: {
            from: "tok_users.id",
            to: "tok_consumers.tokUserId",
        },
    },
};
