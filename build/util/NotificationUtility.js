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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const OneSignalUtility_1 = __importDefault(require("./OneSignalUtility"));
const models_1 = __importDefault(require("../models"));
const moment_1 = __importDefault(require("moment"));
const { Notification } = models_1.default;
const legend = {
    2: {
        title: "Delivery Scheduled",
        body: "We found a suitable rider for you.",
    },
    3: {
        title: "Driver on the Way to Sender",
        body: "Your rider is on the way to pick up the item.",
    },
    4: {
        title: "Item Picked Up",
        body: "Your item has been picked up.",
    },
    5: {
        title: "Driver on the Way to Recipient",
        body: "Your rider is on the way to deliver the item.",
    },
    6: {
        title: "Item Delivered",
        body: "Your item has been delivered.",
    },
    7: {
        title: "Order Cancelled",
        body: "Your order has been cancelled.",
    },
    9: {
        title: "Order Expired",
        body: "Your order has expired.",
    },
};
class default_1 {
}
exports.default = default_1;
default_1.notifyUser = ({ userId, deliveryId, deliveryStatus }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Notification.query().insert({
            title: legend[deliveryStatus].title,
            body: legend[deliveryStatus].body,
            status: 1,
            tokUserId: userId,
            tokDeliveryId: deliveryId,
            createdAt: moment_1.default().format("YYYY-MM-DD HH:mm:ss"),
        });
        yield OneSignalUtility_1.default.pushToUserId({
            title: legend[deliveryStatus].title,
            body: legend[deliveryStatus].body,
            userId: userId,
            data: {
                type: "N",
            },
        });
    }
    catch (error) {
        console.log(error);
    }
});
