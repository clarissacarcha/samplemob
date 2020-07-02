//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql, withFilter } from "apollo-server-express";
import { pubsub } from "../../config/pubsub";

import DeliveryModule from "../model/Delivery";

const typeDefs = gql`
  type DeliveryDispatch {
    delivery: Delivery
    driverId: String
  }

  type Subscription {
    onDeliveryDispatch(userId: String!): DeliveryDispatch
  }
`;

const resolvers = {
  Subscription: {
    onDeliveryDispatch: {
      subscribe: withFilter(
        (_, __, context) => pubsub.asyncIterator("ON_DELIVERY_DISPATCH"),
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

export default new GraphQLModule({
  imports: [DeliveryModule],
  typeDefs,
  resolvers,
});
