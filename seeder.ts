//@ts-nocheck
require("colors");
import { Model } from "objection";
import knex from "./config/knex";
Model.knex(knex);

import Models from "./models";
const { User, Person, Driver } = Models;

const importData = async () => {
  try {
    const UserOne = await User.query().insert({
      username: "userone",
      password: "password",
      active: 1,
      status: 1,
    });

    const PersonOne = await Person.query().insert({
      firstName: "One",
      lastName: "Dummy",
      mobileNumber: "09158868833",
      emailAddress: "userone@gmail.com",
      status: 1,
      tokUserId: UserOne.id,
    });

    const DriverOne = await Driver.query().insert({
      licenseNumber: "LSC1234567890",
      isOnline: true,
      tokUserId: UserOne.id,
    });

    const UserTwo = await User.query().insert({
      username: "usertwo",
      password: "password",
      active: 1,
      status: 1,
    });

    console.log("DATA IMPORTED".green.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

const deleteData = async () => {
  try {
    await User.query().delete();
    await Person.query().delete();
    await Driver.query().delete();

    console.log("DATA DELETED".red.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
