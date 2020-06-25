//@ts-nocheck
const CronJob = require("cron").CronJob;
import NotificationUtility from "./NotificationUtility";

import Models from "../models";
const { Delivery } = Models;

const deliveryExpiration = async () => {
  // Delivery Status 9 = Expired

  // Select expired deliveries
  const expiredDeliveries = await Delivery.query()
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
    .andWhereRaw(
      `(
        (sender_stop.order_type = ? AND now() >= sender_stop.scheduled_from)
        OR
        (recipient_stop.order_type = ? AND now() >= recipient_stop.scheduled_to)
      )`,
      [2, 2]
    );

  // Update expired deliveries
  await Delivery.query()
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
    .andWhereRaw(
      `(
        (sender_stop.order_type = ? AND now() >= sender_stop.scheduled_from)
        OR
        (recipient_stop.order_type = ? AND now() >= recipient_stop.scheduled_to)
      )`,
      [2, 2]
    );

  // Notify users on their expired orders
  expiredDeliveries.map((delivery) => {
    NotificationUtility.notifyUser({
      userId: delivery.consumerUserId,
      deliveryId: delivery.deliveryId,
      deliveryStatus: 9,
    });
  });

  console.log(JSON.stringify(expiredDeliveries, null, 4));
  console.log("Expired Number: " + expiredDeliveries.length);
};

const deliveryExpirationJob = () => {
  const cronjob = new CronJob(
    "*/5 * * * * *", //cronTime
    deliveryExpiration,
    null, //onComplete
    true, //autoStart, if false, run cronjob.start() or .stop()
    "Asia/Manila" //Timezone
  );
};

export const startCronJobs = () => {
  deliveryExpirationJob();
};
