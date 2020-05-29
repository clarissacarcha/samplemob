//@ts-nocheck
import { gql, GraphQLUpload } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

const typeDefs = gql`
  scalar Upload
  scalar DateTime
`;

const resolvers = {
  Upload: GraphQLUpload,
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      console.log("REAL DATE: " + value + "CONVERTED: " + value.toISOString());
      return value.toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

export default {
  typeDefs,
  resolvers,
};
