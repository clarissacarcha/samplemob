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
