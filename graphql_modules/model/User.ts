//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql } from "apollo-server-express";
import Models from "../../models";

const { Person, Consumer, Driver } = Models;

import ConsumerModule from "./Consumer";
import PersonModule from "./Person";
import DriverModule from "./Driver";

const typeDefs = gql`
  type User {
    id: String
    username: String
    status: Int
    person: Person
    consumer: Consumer
    driver: Driver
  }
`;

const resolvers = {
  User: {
    person: async (parent) => {
      return await Person.query().findOne({
        tokUserId: parent.id,
      });
    },
    consumer: async (parent) => {
      return await Consumer.query().findOne({
        tokUserId: parent.id,
      });
    },
    driver: async (parent) => {
      return await Driver.query().findOne({
        tokUserId: parent.id,
      });
    },
  },
};

export default new GraphQLModule({
  imports: [ConsumerModule, PersonModule, DriverModule],
  typeDefs,
  resolvers,
});
