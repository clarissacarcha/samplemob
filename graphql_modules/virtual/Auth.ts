//@ts-nocheck
import { GraphQLModule } from "@graphql-modules/core";
import { gql, UserInputError } from "apollo-server-express";
import {
  REDIS_LOGIN_REGISTER,
  REDIS_FORGOT_PASSWORD,
} from "../../config/redis";
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

  enum ForgotPassword {
    FORGOT
    NOPASSWORD
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

  input ForgotPasswordInput {
    mobile: String!
    appFlavor: String!
    deviceType: String
    deviceId: String
  }

  input ForgotPasswordVerificationInput {
    mobile: String!
    verificationCode: String!
  }

  input ForgotPasswordResetInput {
    mobile: String!
    verificationCode: String!
    password: String!
  }

  type Query {
    getUserSession(input: GetUserSessionInput!): Auth
  }

  type Mutation {
    loginRegister(input: LoginRegisterInput!): LoginRegister
    verifyRegistration(input: VerifyRegistrationInput!): Auth
    verifyLogin(input: VerifyLoginInput!): Auth
    forgotPassword(input: ForgotPasswordInput!): ForgotPassword
    forgotPasswordVerification(input: ForgotPasswordVerificationInput): String
    forgotPasswordReset(input: ForgotPasswordResetInput): String
  }
`;

const SendSmsVerification = (mobile, type) => {
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

  // Save to data to Redus using mobile as key | Expires in 15 minutes
  if (type == "REGISTER") {
    REDIS_LOGIN_REGISTER().set(
      mobile, // key
      JSON.stringify(redisData), // value
      "EX",
      900
    );
    console.log("Registration Verification Code: ", verificationCode);
  }

  if (type == "FORGOT") {
    REDIS_FORGOT_PASSWORD().set(
      mobile, // key
      JSON.stringify(redisData), // value
      "EX",
      600
    );
    console.log("Forgot Password Verification Code: ", verificationCode);
  }
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
            SendSmsVerification(mobile, "REGISTER");
            return "REGISTER";
          } else {
            return "LOGIN";
          }
        }

        // If consumer and user does not exist, proceed to registration.
        if (appFlavor == "C" && !user) {
          SendSmsVerification(mobile, "REGISTER");
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

        console.log({ input });

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

        const phpHashedPassword = user.password;
        const nodeHashedPassword = phpHashedPassword.replace("$2y$", "$2b$");

        const passwordResult = await AuthUtility.verifyHash(
          password,
          nodeHashedPassword
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
    // Send verification code to registered number
    forgotPassword: async (_, { input }) => {
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

        if (!user) {
          throw new UserInputError("User account does not exist.");
        }

        if (user.status == 2) {
          throw new UserInputError("User account does not exist.");
        }

        if (user.status == 3) {
          return "BLOCK";
        }

        // If consumer
        if (appFlavor == "C" && user.driver != null) {
          throw new UserInputError(
            "This transaction cannot be processed in the customer app."
          );
        }

        // If driver
        if (appFlavor == "D" && user.consumer != null) {
          throw new UserInputError(
            "This transaction cannot be processed in the rider app."
          );
        }

        if (user.password == "NA") {
          return "NOPASSWORD";
        }

        SendSmsVerification(mobile, "FORGOT");
        return "FORGOT";
      } catch (error) {
        throw error;
      }
    },

    forgotPasswordVerification: async (_, { input }) => {
      const { mobile, verificationCode } = input;

      const forgotPasswordJson = await REDIS_FORGOT_PASSWORD().get(mobile);
      const forgotPasswordData = JSON.parse(forgotPasswordJson);

      console.log(forgotPasswordData);

      /**
       * Throw error if forgotPasswordData doesn't exist
       * Meaning the data has already expired and is deleted from Redis.
       */
      if (!forgotPasswordData) {
        throw new UserInputError("Verification already expired.");
      }

      /**
       * Throw error if verificationCode provided doesn't match the code stored in Redis.
       */
      if (verificationCode != forgotPasswordData.verificationCode) {
        throw new UserInputError("Invalid verification code.");
      }

      return "RESET";
    },

    forgotPasswordReset: async (_, { input }) => {
      const { mobile, verificationCode, password } = input;

      const forgotPasswordJson = await REDIS_FORGOT_PASSWORD().get(mobile);
      const forgotPasswordData = JSON.parse(forgotPasswordJson);

      /**
       * Throw error if forgotPasswordData doesn't exist
       * Meaning the data has already expired and is deleted from Redis.
       */
      if (!forgotPasswordData) {
        throw new UserInputError("Verification already expired.");
      }

      /**
       * Throw error if verificationCode provided doesn't match the code stored in Redis.
       */
      if (verificationCode != forgotPasswordData.verificationCode) {
        throw new UserInputError("Invalid verification code.");
      }

      const nodehashedPassword = await AuthUtility.generateHashAsync(password);
      const phpHashedPassword = nodehashedPassword.replace("$2b$", "$2y$");

      await User.query()
        .findOne({ username: mobile })
        .patch({ password: phpHashedPassword });

      // Delete Redis data
      await REDIS_LOGIN_REGISTER().del(mobile);

      return "Password reset successful.";
    },
  },
};

export default new GraphQLModule({
  imports: [UserModule],
  typeDefs,
  resolvers,
});
