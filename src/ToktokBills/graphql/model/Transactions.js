import gql from 'graphql-tag'

const transaction = `
  id
  referenceNumber
  senderName
  senderMobileNumber
  destinationNumber
  destinationIdentifier
  billerDetails {
    id
    name
    logo
  }
  loadDetails {
    id
    name
    networkDetails {
      id
      name
    }
  }
  senderWalletBalance
  amount
  senderWalletEndingBalance
  convenienceFee
  discount
  type
  status
  tokUserId
  ofps
  toktokServiceCommission
  startUp
  mcjr
  mcsuper
  jc
  mc
  mcmeg
  others
  providerComValue
  systemServiceFee
  providerServiceFee
  providerComRate
  comType
  createdAt
`

export const GET_BILLS_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionsInput!) {
    getTransactions(input: $input) {
      ${transaction}
    }
  }
`
export const POST_TOKTOKWALLET_REQUEST_MONEY = gql`
  mutation postToktokWalletRequestMoney($input: PostToktokWalletRequestMoneyInput!) {
    postToktokWalletRequestMoney(input: $input) {
      status
      data {
        message
        requestTakeMoneyId
        validator
        referenceNumber
      }
    }
  }
`
export const POST_TRANSACTION = gql`
  mutation postTransaction($input: PostTransactionInput!) {
    postTransaction(input: $input) {
      status
      data {
        ${transaction}
      }
    }
  }
`