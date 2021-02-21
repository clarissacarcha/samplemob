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


export const INITIALIZE_WALLET_CASHIN_DATA = gql`
  mutation initializeWalletCashinData($input: getInitialCashInInput) {
    initializeWalletCashinData(input: $input) {
      signature
      merchantId
      refNo
    }
  }
`;

export const UPDATE_FROM_PAYPANDA_RETURN_URL = gql`
  mutation updateFromPayPandaReturnUrl($input: getPayPandaReturnurl){
    updateFromPayPandaReturnUrl(input: $input){
      message
    }
  }
`;

