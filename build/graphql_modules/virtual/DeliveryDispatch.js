"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const core_1 = require("@graphql-modules/core");
const apollo_server_express_1 = require("apollo-server-express");
const Delivery_1 = __importDefault(require("../model/Delivery"));
const typeDefs = apollo_server_express_1.gql `
  type DeliveryDispatch {
    delivery: Delivery
    driverId: String
  }

  type Subscription {
    onDeliveryDispatch(userId: String!): DeliveryDispatch
  }
`;
const resolvers = {
    Subscription: {
        onDeliveryDispatch: {
            subscribe: apollo_server_express_1.withFilter((_, __, { pubsub }) => pubsub.asyncIterator("ON_DELIVERY_DISPATCH"), (payload, args) => {
                if (payload.userId == args.userId) {
                    return true;
                }
                else {
                    return false;
                }
            }),
            resolve: (value) => {
                return value;
            },
        },
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [Delivery_1.default],
    typeDefs,
    resolvers,
});
