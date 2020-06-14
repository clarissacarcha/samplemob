//@ts-nocheck
import { gql } from "apollo-server-express";
import Models from "../../models";

import PersonModule from "./Person";

const { Driver, User, Person } = Models;

const typeDefs = gql`
  type Driver {
    id: String
    status: Int
    isOnline: Int
    user: User
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
  Mutation: {
    patchDriverGoOnline: async (_: any, { input }: any) => {
      const result = await Driver.query().where({ id: input.driverId }).update({
        isOnline: true,
      });

      return "Successfully gone online.";
    },
    patchDriverGoOffline: async (_: any, { input }: any) => {
      const result = await Driver.query().where({ id: input.driverId }).update({
        isOnline: false,
      });

      return "Successfully gone offine.";
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  imports: [PersonModule],
  typeDefs,
  resolvers,
});
