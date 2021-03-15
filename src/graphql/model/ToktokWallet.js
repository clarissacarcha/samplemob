import gql from 'graphql-tag';

export const GET_TOKTOK_WALLET = gql`
  query getToktokWallet($input: GetToktokWalletInput!) {
    getToktokWallet(input: $input) {
      record {
        id
        balance
        status
        pendingEncashment
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

export const GET_TOKTOK_WALLET_RECENT_TRANSACTIONS = gql`
  query getWalletRecentTransactions($input: ToktokWalletTransactionsInput){
    getWalletRecentTransactions(input: $input){
      title
      logs {
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


export const CHECK_USER_ACCOUNT_WALLET = gql`
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
