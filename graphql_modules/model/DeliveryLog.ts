import { gql } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import Models from "../../models";

const { DeliveryLog } = Models;

import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  type DeliveryLog {
    id: String
    status: Int
    image: S3File
    createdAt: FormattedDateTime
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

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
