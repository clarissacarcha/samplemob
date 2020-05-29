import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Consumer {
    id: String
    rating: Int
    tokUserId: Int
  }
`;

const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
