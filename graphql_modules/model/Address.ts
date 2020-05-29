import { gql } from "apollo-server-express";

const typeDefs = gql`
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

  extend type Person {
    address: Address
  }
`;

const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
