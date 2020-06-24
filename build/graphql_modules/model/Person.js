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
const apollo_server_express_1 = require("apollo-server-express");
const AuthUtility_1 = require("../../util/AuthUtility");
const FileUploadS3_1 = __importDefault(require("../../util/FileUploadS3"));
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const models_1 = __importDefault(require("../../models"));
const { Person, User } = models_1.default;
const typeDefs = apollo_server_express_1.gql `
  type Person {
    id: String
    firstName: String
    middleName: String
    lastName: String
    mobileNumber: String
    emailAddress: String
    birthdate: String
    gender: String
    avatar: S3File
    status: Int
    createdAt: String
    updatedAt: String
    tokUserId: Int
    tokAddressId: Int
  }

  input patchPersonPostRegistrationInput {
    tokUserId: String
    firstName: String
    lastName: String
    emailAddress: String
    password: String
  }

  input patchPersonProfilePictureInput {
    tokUserId: String
    file: Upload
  }

  type Mutation {
    patchPersonPostRegistration(input: patchPersonPostRegistrationInput): String
    patchPersonProfilePicture(input: patchPersonProfilePictureInput): Person
  }
`;
const resolvers = {
    Mutation: {
        // Used for postRegistration and change password
        patchPersonPostRegistration: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { tokUserId, firstName, lastName, emailAddress, password, } = input;
                // Update Person record
                const personResult = yield Person.query()
                    .where({ tokUserId })
                    .patch({ firstName, lastName, emailAddress });
                // Update User password
                if (password) {
                    const nodehashedPassword = yield AuthUtility_1.AuthUtility.generateHashAsync(password);
                    const phpHashedPassword = nodehashedPassword.replace("$2b$", "$2y$");
                    const userResult = yield User.query()
                        .where({ id: tokUserId })
                        .patch({ password: phpHashedPassword });
                }
                return "Profile successfully updated";
            }
            catch (error) {
                throw error;
            }
        }),
        patchPersonProfilePicture: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const { tokUserId, file } = input;
            let uploadedFile;
            console.log(file);
            if (file) {
                uploadedFile = yield FileUploadS3_1.default({
                    file: file,
                    folder: "toktok/",
                });
            }
            yield Person.query()
                .findById(tokUserId)
                .patch(file && { avatar: uploadedFile.filename });
            return yield Person.query().findById(tokUserId);
        }),
    },
};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    imports: [Scalar_1.default],
    typeDefs,
    resolvers,
});
