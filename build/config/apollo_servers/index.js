// require("dotenv").config();
// import { Application } from "express";
// import { ApolloServer, PubSub } from "apollo-server-express";
// import graphqlSchema from "../../api/graphql/schema";
// // import authSchema from '../../api/auth/schema';
// const baseUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/`;
// const pubsub = new PubSub();
// export const mountApolloOnExpressAndServer = (expressApp: Application, httpServer: any) => {
//   const graphqlServer = new ApolloServer({
//     schema: graphqlSchema,
//     context: ({ req, connection }) => {
//       // const accessToken = req ? req.user : "";
//       // const ipAddress = req ? getRequestIP(req) : "";
//       if (connection) {
//         return {
//           ...connection.context,
//           pubsub,
//           // accessToken,
//           // ipAddress,
//           baseUrl,
//         };
//       } else {
//         return {
//           pubsub,
//           // accessToken,
//           // ipAddress,
//           baseUrl,
//         };
//       }
//     },
//     // mocks: true,
//     // introspection: false, // Turn Off Introspection
//     // playground: false, // Turn Off Playground
//     debug: false,
//     formatError(error: any) {
//       console.log(error);
//       return {
//         code: error.extensions.code,
//         message: error.message,
//         path: error.path,
//         error: error,
//       };
//     },
//     subscriptions: {
//       path: "/graphql",
//       onConnect: (connectionParams, websocket, context) => {
//         console.log("---------- SOCKET CONNECTED ----------");
//         // throw new ForbiddenError('Forbidden eh.')
//         return {
//           context,
//         };
//       },
//       onDisconnect: (websocket, context) => {
//         console.log("---------- SOCKET DISCONNECT ----------");
//       },
//       keepAlive: 10000,
//     },
//   });
//   // const authServer = new ApolloServer({
//   //     schema: authSchema,
//   //     context: ({ req, connection }) => {
//   //         const ipAddress = req ? getRequestIP(req) : '';
//   //         if (connection) {
//   //             return {
//   //                 ...connection.context,
//   //                 ipAddress,
//   //                 baseUrl
//   //             }
//   //         } else {
//   //             return {
//   //                 ipAddress,
//   //                 baseUrl
//   //             }
//   //         }
//   //     },
//   //     debug: false,
//   //     formatError(error) {
//   //         console.log(error);
//   //         return {
//   //             code: error.extensions.code,
//   //             message: error.message,
//   //             path: error.path,
//   //             error: error
//   //         }
//   //     },
//   // });
//   /**
//    * Apply ApolloServer instance to Express instanace.
//    */
//   // authServer.applyMiddleware({app, path: '/auth' })
//   graphqlServer.applyMiddleware({ app: expressApp, path: "/graphql" });
//   graphqlServer.installSubscriptionHandlers(httpServer);
//   /**
//    * Returned as function then called from bin/www with created httpServer
//    */
//   // return (httpServer: any) => {
//   //   graphqlServer.installSubscriptionHandlers(httpServer);
//   // };
// };
