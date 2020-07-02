import { gql } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import Models from "../../models";

const { CargoType } = Models;

import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  type CargoType {
    id: String
    type: String
    icon: S3File
  }

  type Query {
    getCargoTypes: [CargoType]
  }
`;

const resolvers = {
  Query: {
    getCargoTypes: async () => {
      return await CargoType.query().where({
        status: 1,
      });
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
