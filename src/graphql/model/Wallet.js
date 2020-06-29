import gql from 'graphql-tag';

export const GET_WALLET = gql`
  query getWallet($input: getWalletInput) {
    getWallet(input: $input) {
      id
      balance
      status
      updated
      toBeDeducted
      available
    }
  }
`;

export const GET_WALLET_LOGS = gql`
  query getWalletLogs($input: GetWalletLogsInput) {
    getWalletLogs(input: $input) {
      id
      type
      balance
      transactionDate
      incoming
      outgoing
    }
  }
`;
