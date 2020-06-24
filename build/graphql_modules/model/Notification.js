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
const core_1 = require("@graphql-modules/core");
const apollo_server_express_1 = require("apollo-server-express");
const Delivery_1 = __importDefault(require("./Delivery"));
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const models_1 = __importDefault(require("../../models"));
const { Notification } = models_1.default;
const typeDefs = apollo_server_express_1.gql `
  type Message {
    id: String
    title: String
    body: String
    status: Int
    createdAt: FormattedDateTime
    tokUserId: String
    tokDeliveryId: String
    delivery: Delivery
  }

  input GetNotificationsInput {
    userId: String!
  }

  type Query {
    getNotifications(input: GetNotificationsInput!): [Message]
  }
`;
const resolvers = {
    Query: {
        getNotifications: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Notification.query()
                .where({
                tokUserId: input.userId,
            })
                .withGraphFetched({
                delivery: true,
            })
                .orderBy("createdAt", "DESC");
            console.log({ result });
            return result;
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [Delivery_1.default, Scalar_1.default],
    typeDefs,
    resolvers,
});
