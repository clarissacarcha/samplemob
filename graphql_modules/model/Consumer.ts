import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Consumer {
    id: String
    rating: Int
    tokUserId: Int
  }
`;

const resolvers = {};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
