import gql from 'graphql-tag'

export const GET_BILLS_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionsInput!) {
    getTransactions(input: $input) {
      id
      referenceNumber
      senderName
      senderMobileNumber
      destinationNumber
      destinationIdentifier
      billerDetails {
        id
        name
      }
      loadDetails {
        id
        name
      }
      senderWalletBalance
      amount
      senderWalletEndingBalance
      convenienceFee
      discount
      type
      status
      tokUserId
      referralCommissionItemId
      merchantCommissionRate
      toktokServiceCommission
      startUp
      mcjr
      mcsuper
      jc
      mc
      mcmeg
      others
      providerOnTopValue
      systemOnTopValue
      providerDiscountRate
      createdAt
    }
  }
`