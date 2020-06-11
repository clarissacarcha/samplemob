"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = __importDefault(require("./Auth"));
const Common_1 = __importDefault(require("./Common"));
const DeliveryDispatch_1 = __importDefault(require("./DeliveryDispatch"));
const OrderPrice_1 = __importDefault(require("./OrderPrice"));
const Scalar_1 = __importDefault(require("./Scalar"));
exports.default = {
    AuthModule: Auth_1.default,
    CommonModule: Common_1.default,
    DeliveryDispatchModule: DeliveryDispatch_1.default,
    OrderPrice: OrderPrice_1.default,
    ScalarModule: Scalar_1.default,
};
