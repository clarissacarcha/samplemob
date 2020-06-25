import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";

import Models from "../../models";

import ScalarModule from "../virtual/Scalar";

const { Announcement } = Models;

const typeDefs = gql`
  type Announcement {
    id: String
    title: String
    body: String
    thumbnail: String
    image: String
    createdAt: FormattedDateTime
    updatedAt: String
  }

  type Query {
    getAnnouncements: [Announcement]
  }
`;

const resolvers = {
  Query: {
    getAnnouncements: async () => {
      return await Announcement.query();
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
