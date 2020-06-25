import gql from 'graphql-tag';

export const GET_WALLET = gql`
  query getWallet($input: getWalletInput) {
    getWallet(input: $input) {
      id
      walletLog {
        id
        type
        balance
        transactionDate
        incoming
        outgoing
      }
      balance
      status
      updated
    }
  }
`;

export const GET_WALLET_LOG = gql`
  query getWallet($input: getWalletInput) {
    getWallet(input: $input) {
      id
      walletLog {
        id
        type
        balance
        transactionDate
        incoming
        outgoing
      }
    }
  }
`;
