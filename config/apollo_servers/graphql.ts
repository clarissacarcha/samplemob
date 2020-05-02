require("dotenv").config();
import { Application } from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
import { 
          UserModule, 
          Person, 
          Address,
          DriverModule,
          VehicleTypeModule
       } from '../../graphql_modules';

const baseUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/`;
const pubsub = new PubSub();

export const mountApolloOnExpressAndServer = (expressApp: Application, httpServer: any) => {
  const graphqlServer = new ApolloServer({
    modules:[
        UserModule, 
        Person, 
        Address,
        DriverModule,
        VehicleTypeModule
    ],
    context: ({ req, connection }) => {
      // const accessToken = req ? req.user : "";
      // const ipAddress = req ? getRequestIP(req) : "";

      if (connection) {
        return {
          ...connection.context,
          pubsub,
          // accessToken,
          // ipAddress,
          baseUrl,
        };
      } else {
        return {
          pubsub,
          // accessToken,
          // ipAddress,
          baseUrl,
        };
      }
    },
    // mocks: true,
    introspection: process.env.NODE_ENV == 'production' ? false : true,
    playground: process.env.NODE_ENV == 'production' ? false : true,
    debug: false,
    formatError(error: any) {
      console.log(error);
      return {
        code: error.extensions.code,
        message: error.message,
        path: error.path,
        error: error,
      };
    },
    subscriptions: {
      path: "/graphql",
      onConnect: (connectionParams, websocket, context) => {
        console.log("---------- SOCKET CONNECTED ----------");
        // throw new ForbiddenError('Forbidden eh.')
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
