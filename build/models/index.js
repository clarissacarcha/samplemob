"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const Address_1 = __importDefault(require("./Address"));
const Announcements_1 = __importDefault(require("./Announcements"));
const Consumer_1 = __importDefault(require("./Consumer"));
const Delivery_1 = __importDefault(require("./Delivery"));
const DeliveryLog_1 = __importDefault(require("./DeliveryLog"));
const Driver_1 = __importDefault(require("./Driver"));
const Message_1 = __importDefault(require("./Message"));
const Person_1 = __importDefault(require("./Person"));
const Stop_1 = __importDefault(require("./Stop"));
const User_1 = __importDefault(require("./User"));
exports.default = {
    Address: Address_1.default,
    Announcement: Announcements_1.default,
    Consumer: Consumer_1.default,
    Delivery: Delivery_1.default,
    DeliveryLog: DeliveryLog_1.default,
    Driver: Driver_1.default,
    Message: Message_1.default,
    Person: Person_1.default,
    Stop: Stop_1.default,
    User: User_1.default,
};
