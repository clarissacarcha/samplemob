#!/usr/bin/env node
//@ts-nocheck
require("dotenv").config();
const colors = require("colors");
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { mountApolloOnExpressAndServer } from "../config/apollo_servers/graphql";
import { deliveryDispatchCronJob } from "../util";
import App from "../App";
import testing from "./testing";

// testing();

const createServer =
  process.env.PROTOCOL === "http" ? createHttpServer : createHttpsServer;

const server = createServer(App);

// Applies ApolloServer as middleware on App and installs subscriptionHandlers on server
//mountApolloOnExpressAndServer(App, server);

server.listen(process.env.PORT, () => {
  //deliveryDispatchCronJob().start();
  console.log(
    `${process.env.PROTOCOL} server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
  return null;
});
