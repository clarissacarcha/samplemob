import gql from 'graphql-tag';

export const GET_COUNTRIES = gql`
  query {
    getCountries {
      id
      numCode
      alpha2Code
      alpha3Code
      name
      nationality
      iso2
    }
  }
`;

export const GET_PROVINCES = gql`
  query {
    getProvinces {
      id
      provDesc
      provCode
    }
  }
`;

export const GET_CITIES = gql`
  query getCities($input: GetCitiesInput) {
    getCities(input: $input) {
      id
      citymunDesc
      citymunCode
    }
  }
`;

export const GET_IDENTIFICATION_CARDS = gql`
  query {
    getIdentificationCards {
      id
      isBackRequired
      name
    }
  }
`;

export const POST_KYC_REGISTER = gql`
  mutation postKycRegister($input: PostKycRegisterInput) {
    postKycRegister(input: $input) {
      id
      status
    }
  }
`;

export const GET_CHECK_ACCOUNT = gql`
  query getCheckAccount($input: GetCheckAccountInput) {
    getCheckAccount(input: $input) {
      id
      mobileNumber
      status
      motherId
      person {
        id
        firstName
        middleName
        lastName
        mobileNumber
        emailAddress
        birthdate
        selfieImage
        gender
        accountType {
          linkLimit
        }
      }
    }
  }
`;

export const GET_LINK_ACCOUNT_OTP = gql`
  query getLinkAccountOTP($input: GetLinkAccountOTPInput) {
    getLinkAccountOTP(input: $input) {
      message
    }
  }
`;

export const VERIFY_LINK_ACCOUNT_OTP = gql`
  query verifyLinkAccountOTP($input: VerifyLinkAccountOTPInput) {
    verifyLinkAccountOTP(input: $input) {
      message
    }
  }
`;

export const GET_SOURCE_OF_INCOME = gql`
  query {
    getSourceOfIncome {
      id
      description
    }
  }
`;

export const GET_SOURCE_OF_WEALTH = gql`
  query {
    getSourceOfWealth {
      id
      description
    }
  }
`;

export const POST_VERIFY_IF_PEP = gql`
  mutation postVerifyIfPep($input: PostVerifyIfPepInput) {
    postVerifyIfPep(input: $input)
  }
`;

export const GET_CHECK_BLOCKED_ACCOUNT_RECORD = gql`
  query getCheckBlockedAccountRecord($input: GetCheckBlockedAccountRecordInput) {
    getCheckBlockedAccountRecord(input: $input)
  }
`;
