"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
require("dotenv").config();
const apollo_server_express_1 = require("apollo-server-express");
const core_1 = require("@graphql-modules/core");
const graphql_modules_1 = __importDefault(require("../../graphql_modules"));
const models_1 = __importDefault(require("../../models"));
const pubsub_1 = require("../pubsub");
const MyGraphQLModule = new core_1.GraphQLModule({
    imports: Object.values(graphql_modules_1.default),
});
const baseUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/`;
exports.mountApolloOnExpressAndServer = (expressApp, httpServer) => {
    const graphqlServer = new apollo_server_express_1.ApolloServer({
        // modules: GraphQLModules,
        schema: MyGraphQLModule.schema,
        // context: MyGraphQLModule.context,
        context: ({ req, connection }) => {
            // const accessToken = req ? req.user : "";
            // const ipAddress = req ? getRequestIP(req) : "";
            if (connection) {
                return Object.assign(Object.assign({}, connection.context), { Models: models_1.default,
                    pubsub: pubsub_1.pubsub,
                    // accessToken,
                    // ipAddress,
                    baseUrl });
            }
            else {
                return {
                    Models: models_1.default,
                    pubsub: pubsub_1.pubsub,
                    // accessToken,
                    // ipAddress,
                    baseUrl,
                };
            }
        },
        // mocks: true,
        introspection: process.env.NODE_ENV == "production" ? false : true,
        playground: process.env.NODE_ENV == "production" ? false : true,
        debug: false,
        formatError(error) {
            console.log(error);
            return {
                code: error.extensions.code,
                message: error.message,
                path: error.path,
            };
        },
        subscriptions: {
            path: "/graphql",
            onConnect: (connectionParams, websocket, context) => {
                console.log("---------- SOCKET CONNECTED ----------");
                return {
                    context,
                };
            },
            onDisconnect: (websocket, context) => {
                console.log("---------- SOCKET DISCONNECT ----------");
            },
            keepAlive: 10000,
        },
    });
    //Apply ApolloServer instance to Express instanace.
    graphqlServer.applyMiddleware({ app: expressApp, path: "/graphql" });
    graphqlServer.installSubscriptionHandlers(httpServer);
};
