import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Person {
    id: String
    firstName: String
    middleName: String
    lastName: String
    mobileNumber: String
    emailAddress: String
    birthdate: String
    gender: String
    avatar: String
    status: Int
    createdAt: String
    updatedAt: String
    tokUserId: Int
    tokAddressId: Int
  }
`;

const resolvers = {};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
