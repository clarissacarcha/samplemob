import { gql } from "apollo-server-express";

import Models from "../../models";

const { Person } = Models;

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
  }

  type Mutation {
    patchPersonPostRegistration(input: patchPersonPostRegistrationInput): String
  }
`;

const resolvers = {
  Mutation: {
    patchPersonPostRegistration: async (_: any, { input }: any) => {
      const result = await Person.query()
        .where({ tokUserId: input.tokUserId })
        .update(input);

      console.log({ result });

      return "Profile successfully updated";
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
