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
    orderType: Int
    scheduledFrom: ISO2DateTime
    scheduledTo: ISO2DateTime
  }

  input AddressInput {
    city: String
    province: String
    country: String
  }

  input SenderStopInput {
    name: String
    mobile: String
    landmark: String
    formattedAddress: String
    latitude: Float
    longitude: Float
    orderType: Int
    scheduledFrom: FormattedDateTime
    scheduledTo: FormattedDateTime
    address: AddressInput
  }

  input RecipientStopInput {
    name: String
    mobile: String
    landmark: String
    cashOnDelivery: String
    notes: String
    cargo: String
    formattedAddress: String
    latitude: Float
    longitude: Float
    orderType: Int
    scheduledFrom: FormattedDateTime
    scheduledTo: FormattedDateTime
    address: AddressInput
  }
`;

const resolvers = {};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
