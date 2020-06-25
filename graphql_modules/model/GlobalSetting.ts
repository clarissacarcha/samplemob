import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";

import Models from "../../models";

const { GlobalSetting } = Models;

const typeDefs = gql`
  type GlobalSetting {
    key: String
    keyValue: String
  }

  type Query {
    getGlobalSettings: [GlobalSetting]
  }
`;

const resolvers = {
  Query: {
    getGlobalSettings: async () => {
      const result = await GlobalSetting.query();

      return result;
    },
  },
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
});
