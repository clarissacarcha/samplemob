import gql from 'graphql-tag';

export const CREATE_ACCOUNT = gql`
  mutation createAccount($input: AccountInput!) {
    createAccount(input: $input) {
      status
      message
    }
  }
`;
export const GET_ACCOUNT = gql`
  query getAccount($input: GetAccountInput!) {
    getAccount(input: $input) {
      id
      userId
      toktokUserid
      firstName
      lastName
      conno
      email
      address1
      address2
      areaid
      gender
      status
    }
  }
`;

export const PATCH_PERSON_HAS_TOKTOKFOOD = gql`
  mutation patchPersonHasToktokFood($input: patchPersonHasToktokFoodInput) {
    patchPersonHasToktokFood(input: $input) {
      status
      message
    }
  }
`;
export const POST_CONTACT_US = gql`
  query postContactUs($input: ContactUsInput!) {
    postContactUs(input: $input) {
      success
      message
    }
  }
`;
