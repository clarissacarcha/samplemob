import gql from 'graphql-tag';

export const GET_GCASH_ACCOUNT = gql`
  query getGCashAccount($input: GetGCashAccountInput!) {
    getGCashAccount(input: $input) {
      record {
        id
        mobileNumber
        firstName
        middleName
        lastName
        streetAddress
        birthdate
        status
      }
    }
  }
`;

export const POST_GCASH_ACCOUNT = gql`
  mutation postGCashAccount($input: PostGCashAccountInput!) {
    postGCashAccount(input: $input) {
      message
    }
  }
`;

export const UPDATE_GCASH_ACCOUNT = gql`
  mutation updateGCashAccount($input: UpdateGCashAccountInput!) {
    updateGCashAccount(input: $input) {
      message
    }
  }
`;
