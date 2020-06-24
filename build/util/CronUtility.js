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
exports.startCronJobs = void 0;
//@ts-nocheck
const CronJob = require("cron").CronJob;
const NotificationUtility_1 = __importDefault(require("./NotificationUtility"));
const models_1 = __importDefault(require("../models"));
const { Delivery } = models_1.default;
const deliveryExpiration = () => __awaiter(void 0, void 0, void 0, function* () {
    // Delivery Status 9 = Expired
    // Select expired deliveries
    const expiredDeliveries = yield Delivery.query()
        .select([
        "tok_deliveries.id as deliveryId",
        "tok_users.id as consumerUserId",
    ])
        .leftJoin("tok_consumers", "tok_consumer_id", "tok_consumers.id")
        .leftJoin("tok_users", "tok_consumers.tok_user_id", "tok_users.id")
        .leftJoinRelated("[senderStop, recipientStop]")
        .where({
        "tok_deliveries.tokDriverId": null,
    })
        .whereNot({
        "tok_deliveries.status": 9,
    })
        .andWhereRaw(`(
        (sender_stop.order_type = ? AND now() >= sender_stop.scheduled_from)
        OR
        (recipient_stop.order_type = ? AND now() >= recipient_stop.scheduled_to)
      )`, [2, 2]);
    // Update expired deliveries
    yield Delivery.query()
        .update({
        status: 9,
    })
        .leftJoinRelated("[senderStop, recipientStop]")
        .where({
        tokDriverId: null,
    })
        .whereNot({
        status: 9,
    })
        .andWhereRaw(`(
        (sender_stop.order_type = ? AND now() >= sender_stop.scheduled_from)
        OR
        (recipient_stop.order_type = ? AND now() >= recipient_stop.scheduled_to)
      )`, [2, 2]);
    // Notify users on their expired orders
    expiredDeliveries.map((delivery) => {
        NotificationUtility_1.default.notifyUser({
            userId: delivery.consumerUserId,
            deliveryId: delivery.deliveryId,
            deliveryStatus: 9,
        });
    });
    console.log(JSON.stringify(expiredDeliveries, null, 4));
    console.log("Expired Number: " + expiredDeliveries.length);
});
const deliveryExpirationJob = () => {
    const cronjob = new CronJob("*/5 * * * * *", //cronTime
    deliveryExpiration, null, //onComplete
    true, //autoStart, if false, run cronjob.start() or .stop()
    "Asia/Manila" //Timezone
    );
};
exports.startCronJobs = () => {
    deliveryExpirationJob();
};
