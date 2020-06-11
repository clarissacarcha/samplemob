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
const core_1 = require("@graphql-modules/core");
const apollo_server_express_1 = require("apollo-server-express");
const models_1 = __importDefault(require("../../models"));
const { Person, Consumer, Driver } = models_1.default;
const Consumer_1 = __importDefault(require("./Consumer"));
const Person_1 = __importDefault(require("./Person"));
const Driver_1 = __importDefault(require("./Driver"));
const typeDefs = apollo_server_express_1.gql `
  type User {
    id: String
    username: String
    status: Int
    person: Person
    consumer: Consumer
    driver: Driver
  }
`;
const resolvers = {
    User: {
        person: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Person.query().findOne({
                tokUserId: parent.id,
            });
        }),
        consumer: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Consumer.query().findOne({
                tokUserId: parent.id,
            });
        }),
        driver: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Driver.query().findOne({
                tokUserId: parent.id,
            });
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [Consumer_1.default, Person_1.default, Driver_1.default],
    typeDefs,
    resolvers,
});
