import { gql } from "apollo-server-express";
import { User } from '../models';

const typeDefs = gql`
  extend type Query {
    user(id: String!): User
    users: [User]
  }

  type User {
    id: Int
    username: String
    password: String
    status: Int
  }
`;

const resolvers = {
  Query: {
    user: (_: any, { id }: { [key: string]: any }) => {
      return {
        username: "Alvir",
        password: "Pass123",
      };
    },
    users: async (): Promise<any> => {
      return await User.query();
    },
  },
};

export const UserModule = {
  typeDefs,
  resolvers,
};
