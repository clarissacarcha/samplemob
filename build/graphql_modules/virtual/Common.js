"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
  type Response {
    message: String!
    code: String
  }
`;
const resolvers = {};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
