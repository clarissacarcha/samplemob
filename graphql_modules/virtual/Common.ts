//@ts-nocheck
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Response {
    message: String!
    code: String
  }
`;

const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
