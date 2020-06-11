"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
  type Stop {
    id: String
    name: String
    mobile: String
    landmark: String
    formattedAddress: String
    latitude: Float
    longitude: Float
  }

  input StopInput {
    name: String
    mobile: String
    landmark: String
    notes: String
    cargo: String
    formattedAddress: String
    latitude: Float
    longitude: Float

    latitudeDelta: Float
    longitudeDelta: Float
    accuracy: Float
  }
`;
const resolvers = {};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
