import gql from 'graphql-tag';

export const PATCH_PERSON_POST_REGISTRATION = gql`
  mutation patchPersonPostRegistration($input: patchPersonPostRegistrationInput) {
    patchPersonPostRegistration(input: $input)
  }
`;
