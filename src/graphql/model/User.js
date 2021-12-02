import gql from 'graphql-tag';

export const PATCH_USER_CHANGE_PASSWORD = gql`
  mutation patchUserChangePassword($input: PatchUserChangePasswordInput!) {
    patchUserChangePassword(input: $input) {
      message
      accessToken
    }
  }
`;
