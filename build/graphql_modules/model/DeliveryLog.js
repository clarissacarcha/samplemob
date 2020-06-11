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
const apollo_server_express_1 = require("apollo-server-express");
const core_1 = require("@graphql-modules/core");
const models_1 = __importDefault(require("../../models"));
const { DeliveryLog } = models_1.default;
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const typeDefs = apollo_server_express_1.gql `
  type DeliveryLog {
    id: String
    status: Int
    image: S3File
    createdAt: DateTime
    tokDeliveryId: String
  }

  type Query {
    getDeliveryLogs: [DeliveryLog]
  }
`;
const resolvers = {
    Query: {
        getDeliveryLogs: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield DeliveryLog.query();
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [Scalar_1.default],
    typeDefs,
    resolvers,
});
