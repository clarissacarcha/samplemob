import gql from 'graphql-tag';

export const LOGIN_REGISTER = gql`
  mutation loginRegister($input: LoginRegisterInput!) {
    loginRegister(input: $input)
  }
`;

export const VERIFY_LOGIN_REGISTER = gql`
  mutation verifyLoginRegister($input: VerifyLoginRegisterInput!) {
    verifyLoginRegister(input: $input) {
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
      }
      accessToken
    }
  }
`;

export const GET_USER_SESSION = gql`
  query getUserSession($input: GetUserSessionInput!) {
    getUserSession(input: $input) {
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
      }
      accessToken
    }
  }
`;
