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
const models_1 = __importDefault(require("../../models"));
const { Announcement } = models_1.default;
const typeDefs = apollo_server_express_1.gql `
  type Announcement {
    id: String
    title: String
    body: String
    thumbnail: String
    image: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    getAnnouncements: [Announcement]
  }
`;
const resolvers = {
    Query: {
        getAnnouncements: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Announcement.query();
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
