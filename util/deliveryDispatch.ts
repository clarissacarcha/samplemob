//@ts-nocheck
const CronJob = require("cron").CronJob;
import { pubsub } from "../config/pubsub";
import Models from "../models";
const { Delivery, User } = Models;

export const deliveryDispatch = async () => {
  // Fetch all Deliveries without an assigned Driver based on tokDriverId = null
  const deliveries = await Delivery.query()
    .where({
      tokDriverId: null,
    })
    .withGraphFetched({
      senderStop: true,
      recipientStop: true,
    });

  console.log("PLACED DELIVERIES: " + deliveries.length);

  // Map through the deliveries, find available driver and call dispatch
  deliveries.forEach(async (delivery) => {
    // Fetch all online drivers
    const onlineDrivers = await User.query()
      .leftJoin("tok_drivers as driver", "tok_users.id", "driver.tokUserId")
      .where({
        "driver.isOnline": true,
      });

    // Map through the drivers found and dispatch the delivery to them
    onlineDrivers.forEach((driverUser) => {
      console.log(`Dispatched ${delivery.id} to ${driverUser.id}`);

      // Publish the driver userId and delivery info on the dispatch channel
      pubsub.publish("ON_DELIVERY_DISPATCH", {
        userId: driverUser.id,
        delivery,
      });
    });
  });
};

export const deliveryDispatchCronJob = () => {
  const cronjob = new CronJob(
    "*/5 * * * * *", //cronTime
    deliveryDispatch,
    null, //onComplete
    false, //Start - set to false for manual trigger
    "Asia/Manila" //Timezone
  );
  return cronjob; // Run .start() .stop() to toggle cronJob
};
