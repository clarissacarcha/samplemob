import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";

import Models from "../../models";

const { GlobalSetting } = Models;

const typeDefs = gql`
  type GlobalSetting {
    settingKey: String
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

      const environmentConstants = [
        {
          settingKey: "consumerOneSignalAppId",
          keyValue: process.env.CONSUMER_ONESIGNAL_APP_ID,
        },
        {
          settingKey: "driverOneSignalAppId",
          keyValue: process.env.DRIVER_ONESIGNAL_APP_ID,
        },
      ];

      return [...result, ...environmentConstants];
    },
  },
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
});
