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
const core_1 = require("@graphql-modules/core");
const apollo_server_express_1 = require("apollo-server-express");
const redis_1 = require("../../config/redis");
const axios_1 = __importDefault(require("axios"));
const User_1 = __importDefault(require("../../models/User"));
const User_2 = __importDefault(require("../model/User"));
const typeDefs = apollo_server_express_1.gql `
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
        getUserSession: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield User_1.default.query()
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
        }),
    },
    Mutation: {
        // User enters mobile number and requests verification code
        loginRegister: (_, { input = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Throw error for empty input.mobile
                if (!input.mobile) {
                    throw new apollo_server_express_1.UserInputError("Please enter your mobile number.");
                }
                // Create a random 6 digit verification code
                let verificationCode;
                if (process.env.NODE_ENV == "development") {
                    verificationCode = "123456";
                }
                else {
                    verificationCode = Math.floor(100000 + Math.random() * 900000);
                    //Send verification code to mobile number
                    axios_1.default.post("https://api.semaphore.co/api/v4/messages", {
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
                redis_1.REDIS_LOGIN_REGISTER().set(input.mobile, // key
                JSON.stringify(redisData), // value
                "EX", 300);
                console.log("Login/Registration Verification Code: ", verificationCode);
                return "Okay";
            }
            catch (error) {
                throw error;
            }
        }),
        // User enters verification and proceeds to login or register
        verifyLoginRegister: (_, { input = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { mobile, verificationCode, accountType } = input;
                console.log({ input });
                let loginRegisterData = yield redis_1.REDIS_LOGIN_REGISTER().get(mobile);
                loginRegisterData = JSON.parse(loginRegisterData);
                console.log({ loginRegisterData });
                /**
                 * Throw error if loginRegisterData doesn't exist
                 * Meaning the data has already expired and is deleted from Redis.
                 */
                if (!loginRegisterData) {
                    throw new apollo_server_express_1.UserInputError("Verification already expired.");
                }
                /**
                 * Throw error if verificationCode provided doesn't match the code stored in Redis.
                 */
                if (verificationCode != loginRegisterData.verificationCode) {
                    throw new apollo_server_express_1.UserInputError("Invalid verification code.");
                }
                // Delete Redis data
                yield redis_1.REDIS_LOGIN_REGISTER().del(mobile);
                // Find an account for the given mobile number.
                const user = yield User_1.default.query()
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
                            throw new apollo_server_express_1.UserInputError("A driver account cannot be used to log in.");
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
                    const createdUser = yield User_1.default.query().insertGraph({
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
                        throw new apollo_server_express_1.UserInputError("Account does not exist.");
                    }
                    // If user has a driver record, proceed to login
                    if (user.driver !== null) {
                        return {
                            user,
                            accessToken: "ABC123",
                        };
                    }
                }
            }
            catch (e) {
                throw e;
            }
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [User_2.default],
    typeDefs,
    resolvers,
});
