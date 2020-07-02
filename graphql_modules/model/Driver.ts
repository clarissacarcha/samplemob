//@ts-nocheck
import { gql } from "apollo-server-express";
import Models from "../../models";

import PersonModule from "./Person";
import ScalarModule from "../virtual/Scalar";

const { Driver, User, Person } = Models;

const typeDefs = gql`
  type Driver {
    id: String
    status: Int
    isOnline: Boolean
    user: User
  }

  input GetDriverLocationFilter {
    driverId: String
  }

  type User {
    id: String
    username: String
    status: Int
    person: Person
  }

  input PatchDriverGoOnlineOfflineInput {
    driverId: String!
  }

  type DriverLocation {
    latitude: Float
    longitude: Float
    lastUpdate: FormattedDateTime
  }

  type Query {
    getDriverLocation(filter: GetDriverLocationFilter): DriverLocation
  }

  type Mutation {
    patchDriverGoOnline(input: PatchDriverGoOnlineOfflineInput!): String
    patchDriverGoOffline(input: PatchDriverGoOnlineOfflineInput!): String
  }
`;

const resolvers = {
  Driver: {
    user: async (parent) => {
      return await User.query().findOne({
        id: parent.tokUserId,
      });
    },
  },
  User: {
    person: async (parent) => {
      return await Person.query().findOne({
        tokUserId: parent.id,
      });
    },
  },
  Query: {
    getDriverLocation: async (_, { filter }) => {
      const { driverId } = filter;

      const driverRecord = await Driver.query().findOne({
        id: driverId,
      });

      return {
        latitude: driverRecord.lastLatitude,
        longitude: driverRecord.lastLongitude,
        lastUpdate: driverRecord.lastLocationUpdate,
      };
    },
  },
  Mutation: {
    patchDriverGoOnline: async (_: any, { input }: any) => {
      await Driver.query().where({ id: input.driverId }).update({
        isOnline: true,
      });

      return "Successfully gone online.";
    },
    patchDriverGoOffline: async (_: any, { input }: any) => {
      await Driver.query().where({ id: input.driverId }).update({
        isOnline: false,
      });

      return "Successfully gone offine.";
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  imports: [PersonModule, ScalarModule],
  typeDefs,
  resolvers,
});
