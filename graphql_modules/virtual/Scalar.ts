import { gql, GraphQLUpload } from "apollo-server-express";

const typeDefs = gql`
  scalar Upload
`;

const resolvers = {
  Upload: GraphQLUpload,
};

export default {
  typeDefs,
  resolvers,
};
