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

  type Query {
    getWalletLog: [WalletLog]
  }
`;

const resolvers = {
  Query: {
    getWalletLog: async () => {
      return await WalletLog.query();
    },
  },
};

export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});