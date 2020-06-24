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
const AuthUtility_1 = require("../../util/AuthUtility");
const typeDefs = apollo_server_express_1.gql `
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
    }
    else {
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        //Send verification code to mobile number
        axios_1.default.post("https://api.semaphore.co/api/v4/messages", {
            apikey: process.env.SEMAPHORE_API_KEY,
            number: mobile,
            message: `${verificationCode} is your toktok registration code. Thank you for registering ka-toktok.`,
        });
    }
    const redisData = {
        mobile,
        verificationCode,
    };
    // Save to data to Redus using mobile as key | Expires in 15 minutes
    if (type == "REGISTER") {
        redis_1.REDIS_LOGIN_REGISTER().set(mobile, // key
        JSON.stringify(redisData), // value
        "EX", 900);
        console.log("Registration Verification Code: ", verificationCode);
    }
    if (type == "FORGOT") {
        redis_1.REDIS_FORGOT_PASSWORD().set(mobile, // key
        JSON.stringify(redisData), // value
        "EX", 600);
        console.log("Forgot Password Verification Code: ", verificationCode);
    }
};
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
        loginRegister: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { mobile, appFlavor } = input;
                // Throw error for empty input.mobile
                if (!mobile) {
                    throw new apollo_server_express_1.UserInputError("Please enter your mobile number.");
                }
                const user = yield User_1.default.query()
                    .findOne({ username: mobile })
                    .withGraphFetched({
                    driver: true,
                    consumer: true,
                });
                // If consumer and user exist, check for password.
                if (appFlavor == "C" && user) {
                    console.log({ user });
                    if (user.driver != null) {
                        throw new apollo_server_express_1.UserInputError("A rider account cannot be used to log in.");
                    }
                    if (user.password == "NA") {
                        SendSmsVerification(mobile, "REGISTER");
                        return "REGISTER";
                    }
                    else {
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
                    throw new apollo_server_express_1.UserInputError("Rider account does not exist");
                }
                if (appFlavor == "D" && user) {
                    if (user.consumer != null) {
                        throw new apollo_server_express_1.UserInputError("Customer account cannot be used to log in on rider app.");
                    }
                    return "LOGIN";
                }
            }
            catch (error) {
                throw error;
            }
        }),
        // User enters verification and proceeds to register
        verifyRegistration: (_, { input = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { mobile, verificationCode, appFlavor, deviceType, deviceId, } = input;
                let loginRegisterData = yield redis_1.REDIS_LOGIN_REGISTER().get(mobile);
                loginRegisterData = JSON.parse(loginRegisterData);
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
                if (user) {
                    if (user.password == "NA") {
                        yield User_1.default.query()
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
                    throw new apollo_server_express_1.UserInputError("User account already exist. Please proceed to login instead.");
                }
                //proceed with consumer registration if user account does not exist
                const createdUser = yield User_1.default.query().insertGraph({
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
            }
            catch (e) {
                throw e;
            }
        }),
        verifyLogin: (_, { input = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { mobile, password, appFlavor, deviceType, deviceId } = input;
                console.log({ input });
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
                // Should always find a user record. Else verifyLogin request was made manually
                if (!user) {
                    throw new apollo_server_express_1.UserInputError("Forbidden Action.");
                }
                const phpHashedPassword = user.password;
                const nodeHashedPassword = phpHashedPassword.replace("$2y$", "$2b$");
                const passwordResult = yield AuthUtility_1.AuthUtility.verifyHash(password, nodeHashedPassword);
                if (!passwordResult) {
                    throw new apollo_server_express_1.UserInputError("Incorrect password.");
                }
                // Check for consumer
                if (appFlavor == "C" && user.driver != null) {
                    throw new apollo_server_express_1.UserInputError("A driver account cannot be used to log in.");
                }
                if (appFlavor == "D" && user.consumer != null) {
                    throw new apollo_server_express_1.UserInputError("Customer account cannot be used to log in on rider app.");
                }
                yield User_1.default.query()
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
            }
            catch (error) {
                throw error;
            }
        }),
        // Send verification code to registered number
        forgotPassword: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { mobile, appFlavor } = input;
                // Throw error for empty input.mobile
                if (!mobile) {
                    throw new apollo_server_express_1.UserInputError("Please enter your mobile number.");
                }
                //Check user with username of mobile. If exist, proceed to PostRegistration/Map. Else. Proceed to Register
                const user = yield User_1.default.query()
                    .findOne({ username: mobile })
                    .withGraphFetched({
                    driver: true,
                    consumer: true,
                });
                if (!user) {
                    throw new apollo_server_express_1.UserInputError("User account does not exist.");
                }
                if (user.status == 2) {
                    throw new apollo_server_express_1.UserInputError("User account does not exist.");
                }
                if (user.status == 3) {
                    return "BLOCK";
                }
                // If consumer
                if (appFlavor == "C" && user.driver != null) {
                    throw new apollo_server_express_1.UserInputError("This transaction cannot be processed in the customer app.");
                }
                // If driver
                if (appFlavor == "D" && user.consumer != null) {
                    throw new apollo_server_express_1.UserInputError("This transaction cannot be processed in the rider app.");
                }
                if (user.password == "NA") {
                    return "NOPASSWORD";
                }
                SendSmsVerification(mobile, "FORGOT");
                return "FORGOT";
            }
            catch (error) {
                throw error;
            }
        }),
        forgotPasswordVerification: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const { mobile, verificationCode } = input;
            const forgotPasswordJson = yield redis_1.REDIS_FORGOT_PASSWORD().get(mobile);
            const forgotPasswordData = JSON.parse(forgotPasswordJson);
            console.log(forgotPasswordData);
            /**
             * Throw error if forgotPasswordData doesn't exist
             * Meaning the data has already expired and is deleted from Redis.
             */
            if (!forgotPasswordData) {
                throw new apollo_server_express_1.UserInputError("Verification already expired.");
            }
            /**
             * Throw error if verificationCode provided doesn't match the code stored in Redis.
             */
            if (verificationCode != forgotPasswordData.verificationCode) {
                throw new apollo_server_express_1.UserInputError("Invalid verification code.");
            }
            return "RESET";
        }),
        forgotPasswordReset: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const { mobile, verificationCode, password } = input;
            const forgotPasswordJson = yield redis_1.REDIS_FORGOT_PASSWORD().get(mobile);
            const forgotPasswordData = JSON.parse(forgotPasswordJson);
            /**
             * Throw error if forgotPasswordData doesn't exist
             * Meaning the data has already expired and is deleted from Redis.
             */
            if (!forgotPasswordData) {
                throw new apollo_server_express_1.UserInputError("Verification already expired.");
            }
            /**
             * Throw error if verificationCode provided doesn't match the code stored in Redis.
             */
            if (verificationCode != forgotPasswordData.verificationCode) {
                throw new apollo_server_express_1.UserInputError("Invalid verification code.");
            }
            const nodehashedPassword = yield AuthUtility_1.AuthUtility.generateHashAsync(password);
            const phpHashedPassword = nodehashedPassword.replace("$2b$", "$2y$");
            yield User_1.default.query()
                .findOne({ username: mobile })
                .patch({ password: phpHashedPassword });
            // Delete Redis data
            yield redis_1.REDIS_LOGIN_REGISTER().del(mobile);
            return "Password reset successful.";
        }),
    },
};
exports.default = new core_1.GraphQLModule({
    imports: [User_2.default],
    typeDefs,
    resolvers,
});
