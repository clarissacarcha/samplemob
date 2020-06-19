//@ts-nocheck
import { gql } from "apollo-server-express";
import { AuthUtility } from "../../util/AuthUtility";

import Models from "../../models";

const { Person, User } = Models;

const typeDefs = gql`
  type Person {
    id: String
    firstName: String
    middleName: String
    lastName: String
    mobileNumber: String
    emailAddress: String
    birthdate: String
    gender: String
    avatar: String
    status: Int
    createdAt: String
    updatedAt: String
    tokUserId: Int
    tokAddressId: Int
  }

  input patchPersonPostRegistrationInput {
    tokUserId: String
    firstName: String
    lastName: String
    emailAddress: String
    password: String
  }

  type Mutation {
    patchPersonPostRegistration(input: patchPersonPostRegistrationInput): String
  }
`;

const resolvers = {
  Mutation: {
    patchPersonPostRegistration: async (_: any, { input }: any) => {
      const { tokUserId, firstName, lastName, emailAddress, password } = input;

      const hashedPassword = await AuthUtility.generateHashAsync(password);

      const personResult = await Person.query()
        .where({ tokUserId })
        .update({ firstName, lastName, emailAddress });

      const userResult = await User.query()
        .where({ id: tokUserId })
        .update({ password: hashedPassword });

      return "Profile successfully updated";
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
