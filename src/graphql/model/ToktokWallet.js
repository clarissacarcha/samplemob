import gql from 'graphql-tag';

export const GET_TOKTOK_WALLET = gql`
  query getToktokWallet($input: GetToktokWalletInput!) {
    getToktokWallet(input: $input) {
      record {
        id
        balance
        status
        pendingEncashment
        isVerified
        isPinSet
      }
    }
  }
`;

export const GET_TOKTOK_WALLET_LOGS = gql`
  query getToktokWalletLogs($input: GetToktokWalletLogsInput!) {
    getToktokWalletLogs(input: $input) {
      records {
        id
        incoming
        outgoing
        balance
        type
        status
        createdAt
      }
    }
  }
`;

// delivery {
//   deliveryId
// }

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

export const CREATE_TOKTOK_WALLET = gql`
  mutation createToktokWallet($input: PostToktokWalletInput!){
    createToktokWallet(input: $input){
      id
    }
  }
`
export const GET_CASH_IN_METHODS = gql`
    query getCashInMethods($input: CashInMethodInput){
        getCashInMethods(input: $input){
          id
          sourceUserId
          destinationUserId
          name
          image
          tokUserId
        }
    }
`
export const GET_TOKTOK_WALLET_CURRENT = gql`
   query getToktokWalletCurrent($input: ToktokWalletInput){
      getToktokWalletCurrent(input: $input){
          id
          balance
          status
          tokUserId
          isVerified
          isPinSet
      }
   }
`
export const INITIALIZE_WALLET_CASHIN_PAYPANDA = gql`
    mutation initializeWalletCashinPayPanda($input: InitialPayPandaCashInInput){
        initializeWalletCashinPayPanda(input: $input){
          signature
          merchantId
          refNo
        }
    }
`
export const UPDATE_FROM_PAYPANDA_RETURN_URL = gql`
  mutation updateFromPayPandaReturnUrl($input: PayPandaReturnUrlInput){
    updateFromPayPandaReturnUrl(input: $input){
      message
    }
  }
`;

export const WALLET_LOG_OUTPUT = `
logDate
logs {
  id
  referenceNumber
  amount
  type
  createdAt
  sourceUserId
  destinationUserId
  logType {
    transferType
    sourceAccountType
    destinationAccountType
  }
  sourceInfo {
    username
    firstName
    middleName
    lastName
    internalAccount
  }
  destinationInfo {
    username
    firstName
    middleName
    lastName
    internalAccount
  }
}`

export const GET_WALLET_RECENT_TRANSACTIONS = gql`
  query getWalletRecentTransactions($input: ToktokWalletTransactionsInput){
    getWalletRecentTransactions(input: $input){
      ${WALLET_LOG_OUTPUT}
    }
  }
`;

export const GET_WALLET_TRANSACTIONS = gql`
  query getWalletTransactions($input: ToktokWalletTransactionsInput){
    getWalletTransactions(input: $input){
      ${WALLET_LOG_OUTPUT}
    }
  }
`
export const CHECK_USER_ACCOUNT = gql`
  query checkUserAccount($input: UserNumberInput){
    checkUserAccount(input: $input){
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
`
export const FUND_TRANSFER_FROM_CONSUMER_TO_CONSUMER = gql`
  mutation fundTransferFromCtoC($input: FundTransferCtoCInput){
    fundTransferFromCtoC(input: $input){
      message
    }
  } 
`
export const CHECK_QR_CODE = gql`
  query checkQRCode($input: QRCodeInput){
    checkQRCode(input: $input){
      id
      name
      image
      contactNo
      type
    }
  }
`

export const GET_CASH_IN_LOGS = gql`
  query getCashInLogs($input: CashInLogsInput){
      getCashInLogs(input: $input){
        logDate
        logs {
          id
          referenceNumber
          amount
          paypandaReferenceNumber
          createdAt
          tokUserId
          tokToktokWalletLogId
          status
          # trails {
          #   id
          #   status
          #   paypandaPostback
          #   createdAt
          # }
        }
      }
  }
`


export const CREATE_PINCODE_TOKTOK_WALLET =gql`
  mutation createPincodeToktokWallet($input: CreatePinInput){
    createPincodeToktokWallet(input: $input){
      message
    }
  }
`

export const CONFIRM_TOKTOK_WALLET_PIN = gql`
  query confirmToktokWalletPIN($input: ConfirmPinInput){
    confirmToktokWalletPIN(input: $input){
      message
    }
  }
`

export const SAVE_VERIFICATION_INFO = gql`
  mutation saveVerificationInfo($input: VerificationInput){
    saveVerificationInfo(input: $input){
      id
      status
    }
  }
`
