import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Person {
    id: Int
    first_name: String
    middle_name: String
    last_name: String
    mobile_number: String
    email_address: String
    birthdate: String
    gender: String
    avatar: String
    status: Int
    created_at: String
    updated_at: String
    tok_user_id: Int
    tok_address_id: Int
  }

  extend type User {
    person: Person
  }

  extend type Query {
    person: Person
  }
`;

const resolvers = {
  Query: {
    person: () => {
      return {
        first_name: 'Alvir'
      }
    }
  }
};

export default {
  typeDefs,
  resolvers
}