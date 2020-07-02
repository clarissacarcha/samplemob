#!/usr/bin/env node
//@ts-nocheck
require("dotenv").config();
import "moment-timezone";
const colors = require("colors");
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { mountApolloOnExpressAndServer } from "../config/apollo_servers/graphql";
import { mountAdminApolloOnExpressAndServer } from "../config/apollo_servers/admin";
import { deliveryDispatchCronJob } from "../util";
import { startCronJobs } from "../util/CronUtility";
import App from "../App";
import testing from "./testing";

testing();

const createServer =
  process.env.PROTOCOL === "http" ? createHttpServer : createHttpsServer;

const server = createServer(App);

// Applies ApolloServer as middleware on App and installs subscriptionHandlers on server
mountApolloOnExpressAndServer(App, server);
mountAdminApolloOnExpressAndServer(App, server);

server.listen(process.env.PORT, () => {
  //deliveryDispatchCronJob().start();
  // startCronJobs();

  console.log(
    `${process.env.PROTOCOL} server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
  return null;
});
