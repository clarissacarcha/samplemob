//@ts-nocheck
import { gql } from "apollo-server-express";

const typeDefs = gql`
    type User {
        id: Int
        username: String
        password: String
        status: Int
    }

    extend type Query {
        user(id: String!): User
        users: [User]
    }
`;

const resolvers = {
    Query: {
        user: (_: any, { id }: { [key: string]: any }, { pubsub }: { [key: string]: any }) => {
            return {
                username: "Alvir",
                password: "Pass123",
            };
        },
        users: async (_, __, { Models, pubsub }): Promise<any> => {
            pubsub.publish("ON_DISPATCH", "FROM DISPATCH");
            return await Models.User.query();
        },
    },
};

export default {
    typeDefs,
    resolvers,
};
