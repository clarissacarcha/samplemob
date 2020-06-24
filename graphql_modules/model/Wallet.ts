//@ts-nocheck
import { gql } from "apollo-server-express";

import WalletLogModule from "./WalletLog";
import { GraphQLModule } from "@graphql-modules/core";
import Models from "../../models";

const { Wallet, WalletLog } = Models;
import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  type Wallet {
    id: String
    tokUsersId: Int
    walletLog: [WalletLog]
    balance: String
    status: Int
    updated: DateTime
  }

  input getWalletInput {
    tokUsersId: String
  }

  type Query {
    getWallet(input: getWalletInput): Wallet
  }
`;

const resolvers = {
  Wallet: {
    walletLog: async (parent) => {
      return await WalletLog.query()
      .where({
        tokWalletId: parent.id,
      })
      .orderBy("transactionDate", "DESC");
    },
  },
  Query: {
    getWallet: async (_, { input = {} }) => {
      const { tokUsersId } = input;
      const result = await Wallet.query().findOne({tokUsersId});
      return result
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule, WalletLogModule],
  typeDefs,
  resolvers,
});