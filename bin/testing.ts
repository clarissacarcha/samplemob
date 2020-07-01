//@ts-nocheck
import Models from "../models";
const { Driver, User, Person, Delivery } = Models;
import OneSignalUtility from "../util/OneSignalUtility";
import DU from "../util/DeliveryUtility";
import moment from "moment";

export default async () => {
  // console.log(
  //   parseInt(moment("3083-12-31", "YYYY-MM-DD").valueOf().toString(), 10)
  //     .toString(32)
  //     .toUpperCase()
  // );
  // console.log(
  //   parseInt(moment().valueOf().toString(), 10).toString(32).toUpperCase()
  // );
  DU.processCompletion({
    deliveryId: "1",
  });
};
