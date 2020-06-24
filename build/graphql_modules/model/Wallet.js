"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const apollo_server_express_1 = require("apollo-server-express");
const WalletLog_1 = __importDefault(require("./WalletLog"));
const core_1 = require("@graphql-modules/core");
const models_1 = __importDefault(require("../../models"));
const { Wallet, WalletLog } = models_1.default;
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const typeDefs = apollo_server_express_1.gql `
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
        walletLog: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield WalletLog.query()
                .where({
                tokWalletId: parent.id,
            })
                .orderBy("transactionDate", "DESC");
        }),
    },
    Query: {
        getWallet: (_, { input = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            const { tokUsersId } = input;
            const result = yield Wallet.query().findOne({ tokUsersId });
            return result;
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [Scalar_1.default, WalletLog_1.default],
    typeDefs,
    resolvers,
});
