import gql from 'graphql-tag';

export const GET_GCASH_ACCOUNT = gql`
  query getGCashAccount($input: GetGCashAccountInput!) {
    getGCashAccount(input: $input) {
      record {
        mobileNumber
        firstName
        middleName
        lastName
        address
        birthdate
        status
      }
    }
  }
`;
