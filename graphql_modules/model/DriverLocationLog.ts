//@ts-nocheck
import { gql } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import Models from "../../models";
import moment from "moment";

const { DriverLocationLog, Driver } = Models;

import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  input PostDriverLocationLogInput {
    latitude: Float
    longitude: Float
    tokDriverId: String
  }

  type Mutation {
    postDriverLocationLog(input: PostDriverLocationLogInput): String
  }
`;

const resolvers = {
  Mutation: {
    postDriverLocationLog: async (_, { input }) => {
      const { latitude, longitude, tokDriverId } = input;

      await DriverLocationLog.query().insert(input);

      await Driver.query().findOne({ id: tokDriverId }).patch({
        lastLatitude: latitude,
        lastLongitude: longitude,
        lastLocationUpdate: new Date(),
      });

      return "Log successfully posted.";
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
