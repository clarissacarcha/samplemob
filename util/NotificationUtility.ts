//@ts-nocheck
import OneSignalUtility from "./OneSignalUtility";
import Models from "../models";
import moment from "moment";

const { Message } = Models;

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

export default class {
  static notifyUser = async ({ userId, deliveryId, deliveryStatus }) => {
    try {
      const result = await Message.query().insert({
        title: legend[deliveryStatus].title,
        body: legend[deliveryStatus].body,
        status: 1,
        tokUserId: userId,
        tokDeliveryId: deliveryId,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      await OneSignalUtility.pushToUserId({
        title: legend[deliveryStatus].title,
        body: legend[deliveryStatus].body,
        userId: userId,
        data: {
          type: "N",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
}
