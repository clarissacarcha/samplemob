import gql from 'graphql-tag';

const Session = `
user {
  id
  username
  status
  person {
    id
    firstName
    middleName
    lastName
    emailAddress
    birthdate
    gender
    avatar
    status
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
  }
  driver {
    id
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
    forgotPassword(input: $input)
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
