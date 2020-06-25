//@ts-nocheck
import OneSignalUtility from "./OneSignalUtility";
import Models from "../models";
import moment from "moment";

const { Notification } = Models;

const legend = {
  1: {
    title: "New Order",
    body: {
      D: "A customer just placed an order.",
    },
  },
  2: {
    title: "Delivery Scheduled",
    body: {
      C: "We found a suitable rider for you.",
    },
  },
  3: {
    title: "Driver on the Way to Sender",
    body: {
      C: "Your rider is on the way to pick up the item.",
    },
  },
  4: {
    title: "Item Picked Up",
    body: {
      C: "Your item has been picked up.",
    },
  },
  5: {
    title: "Driver on the Way to Recipient",
    body: {
      C: "Your rider is on the way to deliver the item.",
    },
  },
  6: {
    title: "Item Delivered",
    body: {
      C: "Your item has been delivered.",
    },
  },
  7: {
    title: "Order Cancelled",
    body: {
      C: "Your order has been cancelled by your rider.",
      D: "Your order has been cancelled by the customer.",
    },
  },
  9: {
    title: "Order Expired",
    body: {
      C: "Your order has expired.",
    },
  },
};

export default class {
  static notifyUser = async (
    { userId, deliveryId, deliveryStatus },
    APP_FLAVOR
  ) => {
    try {
      await Notification.query().insert({
        title: legend[deliveryStatus].title,
        body: legend[deliveryStatus].body[APP_FLAVOR],
        status: 1,
        tokUserId: userId,
        tokDeliveryId: deliveryId,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      await OneSignalUtility.pushToUserId(
        {
          title: legend[deliveryStatus].title,
          body: legend[deliveryStatus].body[APP_FLAVOR],
          userId: userId,
          data: {
            type: "N",
          },
        },
        APP_FLAVOR
      );
    } catch (error) {
      console.log(error);
    }
  };
}
