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
exports.deliveryDispatchCronJob = exports.deliveryDispatch = void 0;
//@ts-nocheck
const CronJob = require("cron").CronJob;
const pubsub_1 = require("../config/pubsub");
const models_1 = __importDefault(require("../models"));
const { Delivery, User } = models_1.default;
exports.deliveryDispatch = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all Deliveries without an assigned Driver based on tokDriverId = null
    const deliveries = yield Delivery.query()
        .where({
        tokDriverId: null,
    })
        .withGraphFetched({
        senderStop: true,
        recipientStop: true,
    });
    // console.log("PLACED DELIVERIES: " + deliveries.length);
    // Map through the deliveries, find available driver and call dispatch
    deliveries.forEach((delivery) => __awaiter(void 0, void 0, void 0, function* () {
        // Fetch all online drivers
        const onlineDrivers = yield User.query()
            .leftJoin("tok_drivers as driver", "tok_users.id", "driver.tokUserId")
            .where({
            "driver.isOnline": true,
        });
        // Map through the drivers found and dispatch the delivery to them
        onlineDrivers.forEach((driverUser) => {
            // console.log(
            //   `Dispatched DeliveryID: ${delivery.id} to Driver UserId: ${driverUser.id}`
            // );
            // Publish the driver userId and delivery info on the dispatch channel
            pubsub_1.pubsub.publish("ON_DELIVERY_DISPATCH", {
                userId: driverUser.id,
                delivery,
            });
        });
    }));
});
exports.deliveryDispatchCronJob = () => {
    const cronjob = new CronJob("*/5 * * * * *", //cronTime
    exports.deliveryDispatch, null, //onComplete
    false, //Start - set to false for manual trigger
    "Asia/Manila" //Timezone
    );
    return cronjob; // Run .start() .stop() to toggle cronJob
};
