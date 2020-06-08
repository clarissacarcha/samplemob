//@ts-nocheck
import { gql, withFilter } from "apollo-server-express";

const typeDefs = gql`
  type DeliveryDispatch {
    delivery: Delivery
    driverId: String
  }

  extend type Subscription {
    onDeliveryDispatch(userId: String!): DeliveryDispatch
  }
`;

const resolvers = {
  Subscription: {
    onDeliveryDispatch: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("ON_DELIVERY_DISPATCH"),
        (payload, args) => {
          if (payload.userId == args.userId) {
            return true;
          } else {
            return false;
          }
        }
      ),
      resolve: (value) => {
        return value;
      },
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
