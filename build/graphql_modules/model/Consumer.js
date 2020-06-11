"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
  type Consumer {
    id: String
    rating: Int
    tokUserId: Int
  }
`;
const resolvers = {};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
