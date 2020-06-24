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
const core_1 = require("@graphql-modules/core");
const models_1 = __importDefault(require("../../models"));
const { WalletLog } = models_1.default;
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const typeDefs = apollo_server_express_1.gql `
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
        getWalletLog: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield WalletLog.query();
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [Scalar_1.default],
    typeDefs,
    resolvers,
});
