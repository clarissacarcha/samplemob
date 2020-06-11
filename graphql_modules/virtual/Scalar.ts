//@ts-nocheck
import { gql, GraphQLUpload } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import { GraphQLScalarType } from "graphql";

const typeDefs = gql`
  scalar Upload
  scalar DateTime
  scalar S3File
`;

const resolvers = {
  Upload: GraphQLUpload,
  S3File: new GraphQLScalarType({
    name: "S3File",
    description: "Scalar for files uploaded in Amazon S3",
    parseValue: async (value) => {
      return value; // value from the client
    },
    serialize: async (value) => {
      return `${process.env.AWS_S3_BASE_URL}${value}`; // value sent to the client
    },
    parseLiteral: async (ast) => {
      return ast.value; // value from the client
    },
  }),
  // DateTime: new GraphQLScalarType({
  //   name: "DateTime",
  //   description: "Date custom scalar type",
  //   parseValue(value) {
  //     return new Date(value); // value from the client
  //   },
  //   serialize(value) {
  //     console.log("REAL DATE: " + value + "CONVERTED: " + value.toISOString());
  //     return value.toISOString(); // value sent to the client
  //   },
  //   parseLiteral(ast) {
  //     if (ast.kind === Kind.INT) {
  //       return new Date(ast.value); // ast value is always in string format
  //     }
  //     return null;
  //   },
  // }),
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
});
