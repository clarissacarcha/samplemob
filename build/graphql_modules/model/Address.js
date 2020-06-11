"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@graphql-modules/core");
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
  type Address {
    id: String
    line1: String
    line2: String
    barangay: String
    city: String
    provice: String
    country: String
    postal: String
  }

  type Person {
    address: Address
  }
`;
const resolvers = {};
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
