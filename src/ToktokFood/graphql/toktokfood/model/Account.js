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
  mutation patchToktokFoodUserId($input: PatchToktokFoodUserIdInput!) {
    patchToktokFoodUserId(input: $input) {
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

export const GET_KYC_STATUS = gql`
  query getKycStatus($input: GetKycStatusInput!) {
    getKycStatus(input: $input) {
      referenceNumber
      status
      account {
        id
        motherReferenceNumber
      }
    }
  }
`;

export const GET_CONSUMER_TYPE = gql`
  query getConsumer {
    getConsumer {
      referralCode
      franchiseeCode
      franchiseeAccountType
    }
  }
`;
