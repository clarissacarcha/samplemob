import { gql } from "apollo-server-express";
import { VehicleTypeModel } from '../models';

const typeDefs = gql`
  extend type Query {
    vehicleTypes: [VehicleType]
    abcq: abc
  }

  type VehicleType {
    id: Int
    type: String
    seats: Int
    cargo_capacity: Int
    cargo_unit: String
    status: Int
    created_at: String
    updated_at: String
  }

  type abc {
    message: String
  }

`;

const resolvers = {
  Query: {
    vehicleTypes: async (): Promise<any> => {
      return await VehicleTypeModel.query();
    },
    abcq: async (): Promise<any> => {

      //return await VehicleTypeModel.create();
    }
  },
};


export const VehicleTypeModule = {
  typeDefs,
  resolvers
};
