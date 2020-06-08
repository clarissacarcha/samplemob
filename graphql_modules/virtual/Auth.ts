//@ts-nocheck
import { gql, UserInputError } from "apollo-server-express";
import { REDIS_LOGIN_REGISTER } from "../../config/redis";
import User from "../../models/User";

const typeDefs = gql`
  type Auth {
    user: User
    accessToken: String
  }

  input LoginRegisterInput {
    mobile: String
  }

  input VerifyLoginRegisterInput {
    mobile: String
    verificationCode: String
  }

  extend type Mutation {
    loginRegister(input: LoginRegisterInput!): String
    verifyLoginRegister(input: VerifyLoginRegisterInput!): Auth
  }
`;

const resolvers = {
  Mutation: {
    // User enters mobile number and requests verification code
    loginRegister: async (_: any, { input = {} }: any) => {
      try {
        // Throw error for empty input.mobile
        if (!input.mobile) {
          throw new UserInputError("Please enter your mobile number.");
        }

        // Create a random 6 digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const redisData = {
          mobile: input.mobile,
          verificationCode,
        };

        // Save to data to Redus using mobile as key | Expires in 5 minutes
        REDIS_LOGIN_REGISTER().set(
          input.mobile, // key
          JSON.stringify(redisData), // value
          "EX",
          300
        );

        console.log("Login/Registration Verification Code: ", verificationCode);

        return "Okay";
      } catch (error) {
        throw error;
      }
    },

    // User enters verification and proceeds to login or register
    verifyLoginRegister: async (_: any, { input = {} }: any) => {
      try {
        const { mobile, verificationCode } = input;

        console.log({ input });

        let loginRegisterData = await REDIS_LOGIN_REGISTER().get(mobile);
        loginRegisterData = JSON.parse(loginRegisterData);

        console.log({ loginRegisterData });

        /**
         * Throw error if loginRegisterData doesn't exist
         * Meaning the data has already expired and is deleted from Redis.
         */
        if (!loginRegisterData) {
          throw new UserInputError("Verification already expired.");
        }

        /**
         * Throw error if verificationCode provided doesn't match the code stored in Redis.
         */
        if (verificationCode != loginRegisterData.verificationCode) {
          throw new UserInputError("Invalid verification code.");
        }

        // Delete Redis data
        await REDIS_LOGIN_REGISTER().del(mobile);

        // Find an account for the given mobile number.
        const user = await User.query().findOne({
          username: mobile,
        });

        // If user account exist, proceed to login
        if (user) {
          return {
            user,
            accessToken: "ABC123",
          };
        }

        // If user account doesn't exist, proceed to register
        if (!user) {
          const createdUser = await User.query().insertGraph({
            username: mobile,
            password: "N/A",
            active: 1,
            status: 1,
            person: {},
            consumer: {},
          });

          console.log({ createdUser });

          return {
            user: createdUser,
            accessToken: "XYZ123",
          };
        }

        return "Okay";
      } catch (e) {
        throw e;
      }
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
