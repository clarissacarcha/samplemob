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
const graphql_1 = require("graphql");
const moment_1 = __importDefault(require("moment"));
const typeDefs = apollo_server_express_1.gql `
  scalar Upload
  scalar DateTime
  scalar S3File
  scalar ISO2DateTime
  scalar FormattedDateTime
`;
const resolvers = {
    Upload: apollo_server_express_1.GraphQLUpload,
    S3File: new graphql_1.GraphQLScalarType({
        name: "S3File",
        description: "Scalar for files uploaded in Amazon S3",
        parseValue: (value) => __awaiter(void 0, void 0, void 0, function* () {
            return value; // value from the client
        }),
        serialize: (value) => __awaiter(void 0, void 0, void 0, function* () {
            return `${process.env.AWS_S3_BASE_URL}${value}`; // value sent to the client
        }),
        parseLiteral: (ast) => __awaiter(void 0, void 0, void 0, function* () {
            return ast.value; // value from the client
        }),
    }),
    ISO2DateTime: new graphql_1.GraphQLScalarType({
        name: "ISO2DateTime",
        description: "Date custom scalar type",
        parseValue(value) {
            return moment_1.default(value).format("YYYY-MM-DD hh:mm:ss"); // value from the client
        },
        serialize(value) {
            return moment_1.default(value).format("MM/DD/YYYY - hh:mm a");
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    FormattedDateTime: new graphql_1.GraphQLScalarType({
        name: "FormattedDateTime",
        description: "Date custom scalar type",
        parseValue(value) {
            return value; // value from the client
        },
        serialize(value) {
            return moment_1.default(value).format("MMM DD YYYY - h:mm a");
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
};
exports.default = new core_1.GraphQLModule({
    typeDefs,
    resolvers,
});
