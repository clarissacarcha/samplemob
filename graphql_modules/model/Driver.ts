//@ts-nocheck
import { gql } from "apollo-server-express";
import Models from "../../models";

const { Driver } = Models;

const typeDefs = gql`
  type Driver {
    id: String
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
  typeDefs,
  resolvers,
});
