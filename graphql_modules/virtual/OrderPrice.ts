//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql, withFilter } from "apollo-server-express";

import { calculateOrderPrice } from "../../util/PricingCalculator";

const typeDefs = gql`
  input GetOrderPriceInput {
    distance: Float!
    senderAddress: AddressInput
    recipientAddress: AddressInput
  }

  input AddressInput {
    city: String
    province: String
    country: String
  }

  type Mutation {
    getOrderPrice(input: GetOrderPriceInput!): Float
  }
`;

const resolvers = {
  Mutation: {
    getOrderPrice: async (_, { input }) => {
      const { senderAddress, recipientAddress, distance } = input;
      const price = calculateOrderPrice({ distance });

      return price;
    },
  },
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
});
