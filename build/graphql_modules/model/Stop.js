"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const apollo_server_express_1 = require("apollo-server-express");
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const typeDefs = apollo_server_express_1.gql `
  type Stop {
    id: String
    name: String
    mobile: String
    landmark: String
    formattedAddress: String
    latitude: Float
    longitude: Float
    orderType: Int
    scheduledFrom: ISO2DateTime
    scheduledTo: ISO2DateTime
  }

  input StopInput {
    name: String
    mobile: String
    landmark: String
    cashOnDelivery: String
    notes: String
    cargo: String
    formattedAddress: String
    latitude: Float
    longitude: Float
    orderType: Int
    scheduledFrom: ISO2DateTime
    scheduledTo: ISO2DateTime

    latitudeDelta: Float
    longitudeDelta: Float
    accuracy: Float
  }
`;
const resolvers = {};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    imports: [Scalar_1.default],
    typeDefs,
    resolvers,
});
