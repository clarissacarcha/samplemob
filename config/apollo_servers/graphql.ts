require("dotenv").config();
import { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import GraphQLModules from "../../graphql_modules";
import Models from "../../models";
import { pubsub } from "../pubsub";

const baseUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/`;

export const mountApolloOnExpressAndServer = (
  expressApp: Application,
  httpServer: any
) => {
  const graphqlServer = new ApolloServer({
    modules: Object.values(GraphQLModules),
    context: ({ req, connection }) => {
      // const accessToken = req ? req.user : "";
      // const ipAddress = req ? getRequestIP(req) : "";

      if (connection) {
        return {
          ...connection.context,
          Models,
          pubsub,
          // accessToken,
          // ipAddress,
          baseUrl,
        };
      } else {
        return {
          Models,
          pubsub,
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
    formatError(error: any) {
      console.log(error);
      return {
        code: error.extensions.code,
        message: error.message,
        path: error.path,
        // error: error,
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
