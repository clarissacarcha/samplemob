import gql from 'graphql-tag';

export const GET_TOKTOK_WALLET_BALANCE = gql`
  query {
    getToktokWalletBalance {
      hasWallet
      balance
    }
  }
`;

export const GET_TOKTOK_WALLET = gql`
  query getToktokWallet($input: GetToktokWalletInput!) {
    getToktokWallet(input: $input) {
      record {
        id
        balance
        status
        tokUserId
        pendingEncashment
        isVerified
        pincode
        isHold
        pinCodeAttempts
        toktokWalletKYC {
          id
          fullname
          nationality
          address
          birthdate
          validIdType
          validIdNumber
          validIdCountry
          validIdPicture
          picture
          tokUserId
          status
          createdAt
          remarks
        }
      }
    }
  }
`;

export const POST_TOKTOK_WALLET = gql`
  mutation postToktokWallet($input: PostToktokWalletInput!) {
    postToktokWallet(input: $input) {
      message
    }
  }
`;

export const TOKTOK_WALLET_ENCASH = gql`
  mutation toktokWalletEncash($input: ToktokWalletEncashInput!) {
    toktokWalletEncash(input: $input) {
      message
    }
  }
`;

export const GET_VERIFY_TOKTOK_WALLET_PIN = gql`
  query getVerifyToktokWalletPIN($input: GetVerifyPinInput) {
    getVerifyToktokWalletPIN(input: $input) {
      result
      message
      attempts
    }
  }
`;

export const PATCH_PINCODE_TOKTOK_WALLET = gql`
  mutation patchPincodeToktokWallet($input: PatchPinInput) {
    patchPincodeToktokWallet(input: $input) {
      message
    }
  }
`;

export const PATCH_FUND_TRANSFER = gql`
  mutation patchFundTransfer($input: PatchFundTransferInput) {
    patchFundTransfer(input: $input) {
      message
      walletLog {
        id
        referenceNumber
        createdAt
      }
    }
  }
`;

export const GET_USER_ACCOUNT = gql`
  query getUserAccount($input: GetUserAccountIput) {
    getUserAccount(input: $input) {
      id
      username
      person {
        firstName
        middleName
        lastName
        avatar
      }
    }
  }
`;

export const GET_QR_CODE = gql`
  query getQRCode($input: GetQRCodeInput) {
    getQRCode(input: $input) {
      id
      name
      image
      contactNo
    }
  }
`;

export const GET_VERIFICATION_CODE = gql`
  query {
    getVerificationCode {
      message
    }
  }
`;

export const CHECK_VERIFICATION_CODE = gql`
  query checkVerificationCode($input: CheckVerificationCodeInput) {
    checkVerificationCode(input: $input) {
      message
    }
  }
`;

export const CHECK_WALLET_LIMITS = gql`
  query checkWalletLimits($input: CheckWalletLimitsInput) {
    checkWalletLimits(input: $input) {
      result
    }
  }
`;
