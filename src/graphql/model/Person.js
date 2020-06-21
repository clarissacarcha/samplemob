import gql from 'graphql-tag';

export const PATCH_PERSON_POST_REGISTRATION = gql`
  mutation patchPersonPostRegistration($input: patchPersonPostRegistrationInput) {
    patchPersonPostRegistration(input: $input)
  }
`;

export const PATCH_PERSON_PROFILE_PICTURE = gql`
  mutation patchPersonProfilePicture($input: patchPersonProfilePictureInput) {
    patchPersonProfilePicture(input: $input) {
      avatar
    }
  }
`;
