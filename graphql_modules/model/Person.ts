//@ts-nocheck
import { gql } from "apollo-server-express";
import { AuthUtility } from "../../util/AuthUtility";
import fileUploadS3 from "../../util/FileUploadS3";
import ScalarModule from "../virtual/Scalar";

import Models from "../../models";

const { Person, User } = Models;

const typeDefs = gql`
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
    patchPersonPostRegistration: async (_: any, { input }: any) => {
      try {
        const {
          tokUserId,
          firstName,
          lastName,
          emailAddress,
          password,
        } = input;

        // Update Person record
        const personResult = await Person.query()
          .where({ tokUserId })
          .patch({ firstName, lastName, emailAddress });

        // Update User password
        if (password) {
          const hashedPassword = await AuthUtility.generateHashAsync(password);

          const userResult = await User.query()
            .where({ id: tokUserId })
            .patch({ password: hashedPassword });
        }

        return "Profile successfully updated";
      } catch (error) {
        throw error;
      }
    },

    patchPersonProfilePicture: async (_, { input }) => {
      const { tokUserId, file } = input;
      let uploadedFile;
      console.log(file);

      if (file) {
        uploadedFile = await fileUploadS3({
          file: file,
          folder: "toktok/",
          // thumbnailFolder: 'user_verification_documents/thumbnail/'
        });
      }
      await Person.query()
        .findById(tokUserId)
        .patch(file && { avatar: uploadedFile.filename });
      return await Person.query().findById(tokUserId);
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  imports: [ScalarModule],
  typeDefs,
  resolvers,
});
