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
    descriptions
    firstFieldName
    secondFieldName
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

export const GET_TRANSACTIONS_BY_STATUS = gql`
  query getTransactionsByStatus($input: GetTransactionsByStatusInput!) {
    getTransactionsByStatus(input: $input) {
      ${transaction}
    }
  }
`
export const GET_BILL_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionsInput!) {
    getTransactions(input: $input) {
      ${transaction}
    }
  }
`
export const POST_TOKTOKWALLET_REQUEST_MONEY = gql`
  mutation postToktokWalletRequestMoney($input: PostToktokWalletRequestMoneyInput!) {
    postToktokWalletRequestMoney(input: $input) {
      hash
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
export const POST_BILLS_TRANSACTION = gql`
  mutation postBillsTransaction($input: PostTransactionInput!) {
    postBillsTransaction(input: $input) {
      status
      data {
        ${transaction}
      }
    }
  }
`
export const POST_BILLS_VALIDATE_TRANSACTION = gql`
  mutation postBillsValidateTransaction($input: PostBillsValidateTransactionInput!) {
    postBillsValidateTransaction(input: $input) {
      Status
      Success
      Message
      ReferenceNumber
      Data {
        FirstField
        SecondField
        Amount
        BillerTag
      }
    }
  }
`