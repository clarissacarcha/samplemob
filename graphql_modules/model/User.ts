//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql, UserInputError } from "apollo-server-express";
import { AuthUtility } from "../../util/AuthUtility";
import Models from "../../models";

const { User, Person, Consumer, Driver } = Models;

import ConsumerModule from "./Consumer";
import PersonModule from "./Person";
import DriverModule from "./Driver";

const typeDefs = gql`
  type User {
    id: String
    userId: String
    username: String
    status: Int
    person: Person
    consumer: Consumer
    driver: Driver
  }

  input PatchUserChangePasswordInput {
    userId: String!
    currentPassword: String!
    newPassword: String!
  }

  type Mutation {
    patchUserChangePassword(input: PatchUserChangePasswordInput!): String
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
  Mutation: {
    patchUserChangePassword: async (_, { input }) => {
      const { userId, currentPassword, newPassword } = input;

      const hashedCurrentPassword = await AuthUtility.generateHashAsync(
        currentPassword
      );

      const userRecord = await User.query().findOne({
        id: userId,
      });

      if (!userRecord) {
        throw new UserInputError("User does not exist.");
      }

      const passwordResult = await AuthUtility.verifyHash(
        currentPassword,
        userRecord.password
      );

      if (!passwordResult) {
        throw new UserInputError("Invalid current password.");
      }

      const hashedNewPassword = await AuthUtility.generateHashAsync(
        newPassword
      );

      await User.query().findOne({ id: userId }).patch({
        password: hashedNewPassword,
      });

      return "Password changed successfully.";
    },
  },
};

export default new GraphQLModule({
  imports: [ConsumerModule, PersonModule, DriverModule],
  typeDefs,
  resolvers,
});
