"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const Address_1 = __importDefault(require("./Address"));
const Consumer_1 = __importDefault(require("./Consumer"));
const Delivery_1 = __importDefault(require("./Delivery"));
const DeliveryLog_1 = __importDefault(require("./DeliveryLog"));
const Driver_1 = __importDefault(require("./Driver"));
const Person_1 = __importDefault(require("./Person"));
const Stop_1 = __importDefault(require("./Stop"));
const User_1 = __importDefault(require("./User"));
exports.default = {
    AddressModule: Address_1.default,
    ConsumerModule: Consumer_1.default,
    DeliveryModule: Delivery_1.default,
    DeliveryLogModule: DeliveryLog_1.default,
    DriverModule: Driver_1.default,
    PersonModule: Person_1.default,
    StopModule: Stop_1.default,
    UserModule: User_1.default,
};
