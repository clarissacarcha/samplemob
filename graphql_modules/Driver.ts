import { gql } from "apollo-server-express";
import { Driver } from '../models';

const typeDefs = gql`
  extend type Query {
    driver(id: String!): Driver
    drivers: [Driver]
  }

  type Driver {
    username: String
    id: Int
    license_number: String
    rating: Int
    status: Int
    created_at: String
    updated_at: String
  }
`;

const resolvers = {
  Query: {
    driver: async (id:string): Promise<any> => {
      //console.log( await Driver.query().select().findById(1));
      let driver = await Driver.query().select('tok_drivers.*','tok_users.username').leftJoin('tok_users', 'tok_users.id','=','tok_drivers.tok_user_id');
      return driver[0];
    },
    drivers: async (): Promise<any> => {
      return await Driver.query();
    },
  },
};

export const DriverModule = {
  typeDefs,
  resolvers,
};
