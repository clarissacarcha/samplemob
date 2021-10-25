import gql from 'graphql-tag';
export const REQUEST_TAKE_MONEY = gql`
  mutation postRequestTakeMoney($input: PostRequestTakeMoneyInput) {
    postRequestTakeMoney(input: $input) {
      success
      message
      data {
        message
        requestTakeMoneyId
        validator
      }
      hash_amount
      orderRefNum
    }
  }
`;
export const VERIFY_PIN = gql`
  mutation verifyPin($input: VerifyPinInput!) {
    verifyPin(input: $input) {
      success
      message
    }
  }
`;