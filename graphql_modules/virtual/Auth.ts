//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql, UserInputError } from "apollo-server-express";
import { REDIS_LOGIN_REGISTER } from "../../config/redis";
import axios from "axios";
import User from "../../models/User";

import UserModule from "../model/User";

const typeDefs = gql`
  type Auth {
    user: User
    accessToken: String
  }

  input GetUserSessionInput {
    userId: String
  }

  input LoginRegisterInput {
    mobile: String
  }

  input VerifyLoginRegisterInput {
    mobile: String!
    verificationCode: String!
    accountType: String!
  }

  type Query {
    getUserSession(input: GetUserSessionInput!): Auth
  }

  type Mutation {
    loginRegister(input: LoginRegisterInput!): String
    verifyLoginRegister(input: VerifyLoginRegisterInput!): Auth
  }
`;

const resolvers = {
  Query: {
    getUserSession: async (_, { input }) => {
      const user = await User.query()
        .findOne({
          id: input.userId,
        })
        .withGraphFetched({
          driver: true,
          person: true,
          consumer: true,
        });

      return {
        user,
        accessToken: "ABC123",
      };
    },
  },
  Mutation: {
    // User enters mobile number and requests verification code
    loginRegister: async (_: any, { input = {} }: any) => {
      try {
        // Throw error for empty input.mobile
        if (!input.mobile) {
          throw new UserInputError("Please enter your mobile number.");
        }

        // Create a random 6 digit verification code
        let verificationCode;
        if (process.env.NODE_ENV == "development") {
          verificationCode = "123456";
        } else {
          verificationCode = Math.floor(100000 + Math.random() * 900000);

          //Send verification code to mobile number
          axios.post("https://api.semaphore.co/api/v4/messages", {
            apikey: process.env.SEMAPHORE_API_KEY,
            number: input.mobile,
            message: `<#> ${verificationCode} is your toktok activation code. N9w/lonc+z1`,
          });
        }
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
        const { mobile, verificationCode, accountType } = input;

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
        const user = await User.query()
          .findOne({
            username: mobile,
          })
          .withGraphFetched({
            driver: true,
            person: true,
            consumer: true,
          });

        console.log(JSON.stringify(user, null, 4));

        // Check for consumer
        if (accountType == "C") {
          if (user) {
            // Cannot proceed with registration
            // Throw error if user has a driver record
            if (user.driver !== null) {
              throw new UserInputError(
                "A driver account cannot be used to log in."
              );
            }

            // If user has a consumer record, proceed to login
            if (user.consumer !== null) {
              return {
                user,
                accessToken: "ABC123",
              };
            }
          }

          //proceed with consumer registration if user account does not exist
          const createdUser = await User.query().insertGraph({
            username: mobile,
            password: "N/A",
            active: 1,
            status: 1,
            person: {},
            consumer: {},
          });

          return {
            user: createdUser,
            accessToken: "XYZ123",
          };
        }

        if (accountType == "D") {
          // Throw error if user has a customer record
          // Cannot proceed with registration
          if (user.customer !== null) {
            throw new UserInputError("Account does not exist.");
          }

          // If user has a driver record, proceed to login
          if (user.driver !== null) {
            return {
              user,
              accessToken: "ABC123",
            };
          }
        }
      } catch (e) {
        throw e;
      }
    },
  },
};

export default new GraphQLModule({
  imports: [UserModule],
  typeDefs,
  resolvers,
});
