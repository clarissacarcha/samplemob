//@ts-nocheck
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Stop {
    id: String
    name: String
    mobile: String
    landmark: String
    formattedAddress: String
    latitude: Float
    longitude: Float
  }

  input StopInput {
    name: String
    mobile: String
    landmark: String
    notes: String
    formattedAddress: String
    latitude: Float
    longitude: Float

    latitudeDelta: Float
    longitudeDelta: Float
    accuracy: Float
  }
`;

const resolvers = {};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
