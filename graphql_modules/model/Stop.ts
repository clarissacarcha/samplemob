//@ts-nocheck
import { gql } from "apollo-server-express";
import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  type Stop {
    id: String
    name: String
    mobile: String
    landmark: String
    formattedAddress: String
    latitude: Float
    longitude: Float
    schedule: Int
    preferredFrom: DateTime
    preferredTo: DateTime
  }

  input StopInput {
    name: String
    mobile: String
    landmark: String
    notes: String
    cargo: String
    formattedAddress: String
    latitude: Float
    longitude: Float
    schedule: Int
    preferredFrom: String
    preferredTo: String

    latitudeDelta: Float
    longitudeDelta: Float
    accuracy: Float
  }
`;

const resolvers = {};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
