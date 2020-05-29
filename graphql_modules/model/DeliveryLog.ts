import { gql } from "apollo-server-express";

const typeDefs = gql`
  type DeliveryLog {
    id: String
    status: Int
    image: String
    createdAt: DateTime
    tokDeliveryId: String
  }
`;

const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
