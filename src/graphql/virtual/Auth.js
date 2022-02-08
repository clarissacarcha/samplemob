import gql from 'graphql-tag';

// TODO: ASS IN USER
//  toktokfoodUserId
// toktokWalletAccountId

const Session = `
user {
  id
  userId
  username
  status
  toktokfoodUserId
  toktokWalletAccountId
  hasEarlyAccess
  hasDriverAccount
  person {
    id
    firstName
    middleName
    lastName
    emailAddress
    birthdate
    gender
    avatar
    avatarThumbnail
    status
    mobileNumber
    address {
      line1
      line2
      barangay
      city
      provice
      country
      postal
    }
  }
  consumer {
    id
    rating
    referralCode
    referralName
    franchiseeCode
    franchiseeFirstName
    franchiseeLastName
    franchiseeAccountType
    status
  }
  driver {
    id
    licenseNumber
    isOnline
    status
    driverIdLink
    operatorPerson {
      firstName
      lastName
      mobileNumber
      emailAddress
    }
  }
  wallet {
    id
  }
}
accessToken
`;

export const LOGIN_REGISTER = gql`
  mutation loginRegister($input: LoginRegisterInput!) {
    loginRegister(input: $input)
  }
`;

export const VERIFY_REGISTRATION = gql`
  mutation verifyRegistration($input: VerifyRegistrationInput!) {
    verifyRegistration(input: $input) {
      ${Session}
    }
  }
`;

export const VERIFY_LOGIN = gql`
  mutation verifyLogin($input: VerifyLoginInput!) {
    verifyLogin(input: $input) {
      ${Session}
    }
  }
`;

export const GET_USER_SESSION = gql`
  query getUserSession($input: GetUserSessionInput!) {
    getUserSession(input: $input) {
      ${Session}
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      message
      payload
    }
  }
`;

export const FORGOT_PASSWORD_VERIFICATION = gql`
  mutation forgotPasswordVerification($input: ForgotPasswordVerificationInput!) {
    forgotPasswordVerification(input: $input)
  }
`;

export const FORGOT_PASSWORD_RESET = gql`
  mutation forgotPasswordReset($input: ForgotPasswordResetInput!) {
    forgotPasswordReset(input: $input)
  }
`;

export const END_USER_SESSION = gql`
  mutation {
    endUserSession {
      message
    }
  }
`;
