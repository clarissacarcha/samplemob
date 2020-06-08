import { gql } from "apollo-server-express";
import Models from "../../models";

const { Delivery, DeliveryLog, Stop } = Models;

const typeDefs = gql`
  type DeliveryLog {
    id: String
    status: Int
    image: S3File
    createdAt: DateTime
    tokDeliveryId: String
  }

  type Query {
    getDeliveryLogs: [DeliveryLog]
  }
`;

const resolvers = {
  Query: {
    getDeliveryLogs: async () => {
      return await DeliveryLog.query();
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
