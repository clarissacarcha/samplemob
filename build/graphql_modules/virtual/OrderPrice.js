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
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const core_1 = require("@graphql-modules/core");
const apollo_server_express_1 = require("apollo-server-express");
const PricingCalculator_1 = require("../../util/PricingCalculator");
const typeDefs = apollo_server_express_1.gql `
  input GetOrderPriceInput {
    distance: Float!
  }

  type Mutation {
    getOrderPrice(input: GetOrderPriceInput!): Float
  }
`;
const resolvers = {
    Mutation: {
        getOrderPrice: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const price = PricingCalculator_1.calculateOrderPrice({ distance: input.distance });
            return price;
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
