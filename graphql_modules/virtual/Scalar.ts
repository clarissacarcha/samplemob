//@ts-nocheck
import { gql, GraphQLUpload } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import { GraphQLScalarType, Kind } from "graphql";
import moment from "moment";

const typeDefs = gql`
  scalar Upload
  scalar DateTime
  scalar S3File
  scalar ISO2DateTime
  scalar FormattedDateTime
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
  ISO2DateTime: new GraphQLScalarType({
    name: "ISO2DateTime",
    description: "Date custom scalar type",
    parseValue(value) {
      return moment(value).format("YYYY-MM-DD hh:mm:ss"); // value from the client
    },
    serialize(value) {
      return moment(value).format("MM/DD/YYYY - hh:mm a");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
  FormattedDateTime: new GraphQLScalarType({
    name: "FormattedDateTime",
    description: "Date custom scalar type",
    parseValue(value) {
      // return moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD hh:mm:ss"); // value from the client
      return value;
    },
    serialize(value) {
      const dateValue = moment(value).tz("Asia/Manila").format("YYYY-MM-DD");
      const phTodayDate = moment().tz("Asia/Manila").format("YYYY-MM-DD");
      const phTomorrowDate = moment()
        .add(1, "days")
        .tz("Asia/Manila")
        .format("YYYY-MM-DD");

      if (dateValue == phTodayDate) {
        return `Today - ${moment(value).format("h:mm a")}`;
      }

      if (dateValue == phTomorrowDate) {
        return `Tomorrow - ${moment(value).format("h:mm a")}`;
      }

      return moment(value).format("MMM DD YYYY - h:mm a");
    },
    parseLiteral(ast) {
      // if (ast.kind === Kind.INT) {
      //   return new Date(ast.value); // ast value is always in string format
      // }
      return ast.value;
    },
  }),
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
});
