//@ts-nocheck
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Response {
    message: String!
    code: String
  }
`;

const resolvers = {};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
