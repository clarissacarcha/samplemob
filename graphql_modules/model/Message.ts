import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";

import DeliveryModule from "./Delivery";
import ScalarModule from "../virtual/Scalar";

import Models from "../../models";

const { Message } = Models;

const typeDefs = gql`
  type Message {
    id: String
    title: String
    body: String
    status: Int
    createdAt: FormattedDateTime
    tokUserId: String
    tokDeliveryId: String
    delivery: Delivery
  }

  input GetMessagesInput {
    userId: String!
  }

  type Query {
    getMessages(input: GetMessagesInput!): [Message]
  }
`;

const resolvers = {
  Query: {
    getMessages: async (_, { input }) => {
      const result = await Message.query()
        .where({
          tokUserId: input.userId,
        })
        .withGraphFetched({
          delivery: true,
        })
        .orderBy("createdAt", "DESC");

      console.log({ result });

      return result;
    },
  },
};

export default new GraphQLModule({
  imports: [DeliveryModule, ScalarModule],
  typeDefs,
  resolvers,
});
