import Models from "../models";
const { Driver, User, Person, Delivery } = Models;
import OneSignalUtility from "../util/OneSignalUtility";
import moment from "moment";

export default async () => {
  const milimoment = moment().valueOf().toString();
  // const id = parseInt(milimoment, 10).toString(32).toUpperCase();
  console.log(
    parseInt(moment().valueOf().toString(), 10).toString(32).toUpperCase()
  );
  console.log(
    parseInt(moment().valueOf().toString(), 10).toString(32).toUpperCase()
  );
  console.log(
    parseInt(moment().valueOf().toString(), 10).toString(32).toUpperCase()
  );
};
