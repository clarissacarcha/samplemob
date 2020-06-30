//@ts-nocheck
require("colors");
import { Model } from "objection";
import knex from "./config/knex";
Model.knex(knex);

import Models from "./models";
const { GlobalSetting } = Models;

const importData = async () => {
  try {
    await knex("tok_global_settings").insert([
      {
        description: "Website Display Name",
        settingKey: "websiteDisplayName",
        keyValue: "www.toktok.ph",
        unit: "String",
        status: "1",
      },
      {
        description: "Website Valid URL",
        settingKey: "websiteValidUrl",
        keyValue: "http://www.toktok.ph",
        unit: "String",
        status: "1",
      },
      {
        description: "Talk to Us Email",
        settingKey: "talkToUsEmail",
        keyValue: "support@cloudpanda.ph",
        unit: "String",
        status: "1",
      },
      {
        description: "Maximum number of ongoing deliveries a rider can have.",
        settingKey: "riderMaxOngoingOrders",
        keyValue: "2",
        unit: "Number",
        status: "1",
      },
      {
        description:
          "Radius from sender location to find riders and send push notification of newly created order.",
        settingKey: "newOrderNotificationRadius",
        keyValue: "50",
        unit: "km",
        status: "1",
      },
      {
        description: "Radius from rider location to find available orders.",
        settingKey: "riderFindOrderRadius",
        keyValue: "50",
        unit: "km",
        status: "1",
      },
      {
        description: "Maximum amount for Cash on Delivery orders.",
        settingKey: "maxCashOnDelivery",
        keyValue: "2000",
        unit: "Philippine Peso",
        status: "1",
      },
      {
        description: "Interval for rider location update logs",
        settingKey: "driverLocationLogInterval",
        keyValue: "600000", // 600 seconds, 10 minutes
        unit: "miliseconds",
        status: "1",
      },
      {
        description: "toktok commission from completed orders.  ",
        settingKey: "toktokOrderCommission",
        keyValue: "0.20", // 20%
        unit: "decimal",
        status: "1",
      },
    ]);

    console.log("GLOBAL SETTINGS CREATED".green.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    GlobalSetting.query().delete();

    console.log("GLOBAL SETTINGS DATA DELETED".red.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
