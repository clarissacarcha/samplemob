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
const models_1 = __importDefault(require("../../models"));
const { Person } = models_1.default;
const typeDefs = apollo_server_express_1.gql `
  type Person {
    id: String
    firstName: String
    middleName: String
    lastName: String
    mobileNumber: String
    emailAddress: String
    birthdate: String
    gender: String
    avatar: String
    status: Int
    createdAt: String
    updatedAt: String
    tokUserId: Int
    tokAddressId: Int
  }

  input patchPersonPostRegistrationInput {
    tokUserId: String
    firstName: String
    lastName: String
    emailAddress: String
  }

  type Mutation {
    patchPersonPostRegistration(input: patchPersonPostRegistrationInput): String
  }
`;
const resolvers = {
    Mutation: {
        patchPersonPostRegistration: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Person.query()
                .where({ tokUserId: input.tokUserId })
                .update(input);
            console.log({ result });
            return "Profile successfully updated";
        }),
    },
};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
