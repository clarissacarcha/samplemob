import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";
import AnnouncementUtilty from "../../util/AnnouncementUtility";

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
  }

  input GetAnnouncementsFilter {
    appFlavor: AppFlavor
  }

  enum AppFlavor {
    C
    D
  }

  input PostAnnouncementInput {
    appFlavor: AppFlavor!
    title: String!
    body: String!
    image: String!
    thumbnail: String!
  }

  type Query {
    getAnnouncements(filter: GetAnnouncementsFilter): [Announcement]
  }

  type Mutation {
    postAnnouncement(input: PostAnnouncementInput): String
  }
`;

const resolvers = {
  Query: {
    getAnnouncements: async (_, { filter }) => {
      const { appFlavor } = filter;
      return await Announcement.query()
        .where({ status: 1, appFlavor })
        .orderBy("createdAt", "DESC");
    },
  },
  Mutation: {
    postAnnouncement: async (_, { input }) => {
      const { title, body, appFlavor } = input;
      await Announcement.query().insert({
        ...input,
        status: 1,
      });

      if (appFlavor == "C") {
        AnnouncementUtilty.notifyConsumers({ title, body });
      }

      if (appFlavor == "D") {
        AnnouncementUtilty.notifyDrivers({ title, body });
      }

      return "Announcement successfully created.";
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
