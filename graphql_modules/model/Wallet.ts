//@ts-nocheck
import { gql } from "apollo-server-express";

import WalletLogModule from "./WalletLog";
import { GraphQLModule } from "@graphql-modules/core";
import Models from "../../models";

const { Wallet, User, Delivery } = Models;
import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  type Wallet {
    id: String
    tokUsersId: Int
    balance: Float
    status: Int
    updated: DateTime
    toBeDeducted: Float
    available: Float
  }

  input getWalletInput {
    userId: String
  }

  type Query {
    getWallet(input: getWalletInput): Wallet
  }
`;

const resolvers = {
  Query: {
    getWallet: async (_, { input = {} }) => {
      const { userId } = input;
      const walletResult = await Wallet.query().findOne({ tokUsersId: userId });

      const user = await User.query().findOne({ id: userId }).withGraphFetched({
        consumer: true,
        driver: true,
      });

      let toBeDeducted = 0;

      if (user.driver) {
        const deliveryResult = await Delivery.query()
          .sum("price as toBeDeducted")
          .where({
            tokDriverId: user.driver.id,
          })
          .whereIn("status", [2, 3, 4, 5]);

        if (deliveryResult[0].toBeDeducted) {
          toBeDeducted = deliveryResult[0].toBeDeducted;
        }
      }

      return {
        ...walletResult,
        toBeDeducted,
        available: walletResult.balance - toBeDeducted,
      };
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule, WalletLogModule],
  typeDefs,
  resolvers,
});
