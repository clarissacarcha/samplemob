//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql, UserInputError } from "apollo-server-express";
import { REDIS_LOGIN_REGISTER } from "../../config/redis";
import axios from "axios";
import User from "../../models/User";

import UserModule from "../model/User";
import { AuthUtility } from "../../util/AuthUtility";

const typeDefs = gql`
  type Auth {
    user: User
    accessToken: String
  }

  enum LoginRegister {
    LOGIN
    REGISTER
    BLOCK
  }

  enum AppFlavor {
    C
    D
  }

  input GetUserSessionInput {
    userId: String
  }

  input LoginRegisterInput {
    mobile: String
    appFlavor: AppFlavor
  }

  input VerifyRegistrationInput {
    mobile: String!
    verificationCode: String!
    appFlavor: String!
    deviceType: String
    deviceId: String
  }

  input VerifyLoginInput {
    mobile: String!
    password: String!
    appFlavor: String!
    deviceType: String
    deviceId: String
  }

  type Query {
    getUserSession(input: GetUserSessionInput!): Auth
  }

  type Mutation {
    loginRegister(input: LoginRegisterInput!): LoginRegister
    verifyRegistration(input: VerifyRegistrationInput!): Auth
    verifyLogin(input: VerifyLoginInput!): Auth
  }
`;

const SendSmsVerification = (mobile) => {
  // Create a random 6 digit verification code
  let verificationCode;
  if (process.env.NODE_ENV == "development") {
    verificationCode = "123456";
  } else {
    verificationCode = Math.floor(100000 + Math.random() * 900000);

    //Send verification code to mobile number
    axios.post("https://api.semaphore.co/api/v4/messages", {
      apikey: process.env.SEMAPHORE_API_KEY,
      number: mobile,
      message: `${verificationCode} is your toktok registration code. Thank you for registering ka-toktok.`,
      // message: `<#> ${verificationCode} is your toktok activation code. N9w/lonc+z1`,
    });
  }
  const redisData = {
    mobile,
    verificationCode,
  };

  // Save to data to Redus using mobile as key | Expires in 5 minutes
  REDIS_LOGIN_REGISTER().set(
    mobile, // key
    JSON.stringify(redisData), // value
    "EX",
    300
  );

  console.log("Login/Registration Verification Code: ", verificationCode);
};

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
    loginRegister: async (_: any, { input }: any) => {
      try {
        const { mobile, appFlavor } = input;

        // Throw error for empty input.mobile
        if (!mobile) {
          throw new UserInputError("Please enter your mobile number.");
        }

        //Check user with username of mobile. If exist, proceed to PostRegistration/Map. Else. Proceed to Register
        const user = await User.query()
          .findOne({ username: mobile })
          .withGraphFetched({
            driver: true,
            consumer: true,
          });

        // If consumer and user exist, check for password.
        if (appFlavor == "C" && user) {
          console.log({ user });
          if (user.driver != null) {
            throw new UserInputError(
              "A rider account cannot be used to log in."
            );
          }

          if (user.password == "NA") {
            SendSmsVerification(mobile);
            return "REGISTER";
          } else {
            return "LOGIN";
          }
        }

        // If consumer and user does not exist, proceed to registration.
        if (appFlavor == "C" && !user) {
          SendSmsVerification(mobile);
          return "REGISTER";
        }

        // If driver and user does not exist, throw error
        if (appFlavor == "D" && !user) {
          throw new UserInputError("Rider account does not exist");
        }

        if (appFlavor == "D" && user) {
          if (user.consumer != null) {
            throw new UserInputError(
              "Customer account cannot be used to log in on rider app."
            );
          }

          return "LOGIN";
        }
      } catch (error) {
        throw error;
      }
    },

    // User enters verification and proceeds to register
    // TODO: rename to verifyRegistration
    verifyRegistration: async (_: any, { input = {} }: any) => {
      try {
        const {
          mobile,
          verificationCode,
          appFlavor,
          deviceType,
          deviceId,
        } = input;

        let loginRegisterData = await REDIS_LOGIN_REGISTER().get(mobile);
        loginRegisterData = JSON.parse(loginRegisterData);

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

        if (user) {
          if (user.password == "NA") {
            await User.query()
              .findOne({
                username: mobile,
              })
              .patch({
                deviceType,
                deviceId,
              });

            return {
              user,
              accessToken: "XYZ123",
            };
          }
          throw new UserInputError(
            "User account already exist. Please proceed to login instead."
          );
        }

        //proceed with consumer registration if user account does not exist
        const createdUser = await User.query().insertGraph({
          username: mobile,
          password: "NA",
          active: 1,
          status: 1,
          person: {},
          consumer: {},
          failedLoginAttempts: 0,
          deviceType,
          deviceId,
        });

        return {
          user: createdUser,
          accessToken: "XYZ123",
        };
      } catch (e) {
        throw e;
      }
    },

    verifyLogin: async (_: any, { input = {} }: any) => {
      try {
        const { mobile, password, appFlavor, deviceType, deviceId } = input;

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

        // Should always find a user record. Else verifyLogin request was made manually
        if (!user) {
          throw new UserInputError("Forbidden Action.");
        }

        const passwordResult = await AuthUtility.verifyHash(
          password,
          user.password
        );

        if (!passwordResult) {
          throw new UserInputError("Incorrect password.");
        }

        // Check for consumer
        if (appFlavor == "C" && user.driver != null) {
          throw new UserInputError(
            "A driver account cannot be used to log in."
          );
        }

        if (appFlavor == "D" && user.consumer != null) {
          throw new UserInputError(
            "Customer account cannot be used to log in on rider app."
          );
        }

        await User.query()
          .findOne({
            username: mobile,
          })
          .patch({
            deviceType,
            deviceId,
          });

        return {
          user: user,
          accessToken: "XYZ123",
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

export default new GraphQLModule({
  imports: [UserModule],
  typeDefs,
  resolvers,
});
