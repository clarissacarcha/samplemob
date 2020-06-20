import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";

import Models from "../../models";

const { Message } = Models;

const typeDefs = gql`
  type Message {
    id: String
    title: String
    body: String
    thumbnail: String
    image: String
    createdAt: String
    updatedAt: String
  }

  input GetMessageInput {
    userId: String!
  }

  type Query {
    getMessages(input: GetMessageInput!): [Message]
  }
`;

const resolvers = {
  Query: {
    getMessages: async (_, { input }) => {
      return await Message.query().where({
        tokUserId: input.userId,
      });
    },
  },
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
});
