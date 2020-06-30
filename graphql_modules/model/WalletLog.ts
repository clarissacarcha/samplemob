//@ts-nocheck
import { gql } from "apollo-server-express";

import { GraphQLModule } from "@graphql-modules/core";
import Models from "../../models";

const { WalletLog } = Models;
import ScalarModule from "../virtual/Scalar";

const typeDefs = gql`
  type WalletLog {
    id: String
    type: String
    balance: String
    transactionDate: FormattedDateTime
    incoming: String
    outgoing: String
    tokWalletId: String
  }

  input GetWalletLogsInput {
    walletId: String
  }

  type Query {
    getWalletLogs(input: GetWalletLogsInput): [WalletLog]
  }
`;

const resolvers = {
  Query: {
    getWalletLogs: async (_, { input }) => {
      const { walletId } = input;

      return await WalletLog.query()
        .where({
          tokWalletId: walletId,
        })
        .orderBy("transactionDate", "DESC");
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
