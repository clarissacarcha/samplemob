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
        description: "Maximum number of ongoing deliveries a rider can have.",
        key: "maxConcurrentOrders",
        keyValue: "2",
        unit: "",
        status: "1",
      },
      {
        description: "Website Display Name",
        key: "websiteDisplayName",
        keyValue: "www.toktok.ph",
        unit: "",
        status: "1",
      },
      {
        description: "Website Valid URL",
        key: "websiteValidUrl",
        keyValue: "http://www.toktok.ph",
        unit: "",
        status: "1",
      },
      {
        description: "Talk to Us Email",
        key: "talkToUsEmail",
        keyValue: "support@cloudpanda.ph",
        unit: "",
        status: "1",
      },
      {
        description:
          "Radius from sender location to find riders and send push notification of newly created order.",
        key: "newOrderNotificationRadius",
        keyValue: "50",
        unit: "km",
        status: "1",
      },
      {
        description: "Radius from rider location to find available orders.",
        key: "riderFindOrderRadius",
        keyValue: "50",
        unit: "km",
        status: "1",
      },
    ]);

    console.log("SEEDS CREATED".green.inverse);
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
