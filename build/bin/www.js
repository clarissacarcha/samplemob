#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
require("dotenv").config();
const colors = require("colors");
const http_1 = require("http");
const https_1 = require("https");
const graphql_1 = require("../config/apollo_servers/graphql");
const App_1 = __importDefault(require("../App"));
const testing_1 = __importDefault(require("./testing"));
testing_1.default();
const createServer = process.env.PROTOCOL === "http" ? http_1.createServer : https_1.createServer;
const server = createServer(App_1.default);
// Applies ApolloServer as middleware on App and installs subscriptionHandlers on server
graphql_1.mountApolloOnExpressAndServer(App_1.default, server);
server.listen(process.env.PORT, () => {
    //deliveryDispatchCronJob().start();
    console.log(`${process.env.PROTOCOL} server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
        .yellow.bold);
    return null;
});
