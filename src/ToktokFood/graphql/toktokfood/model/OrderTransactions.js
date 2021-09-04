import gql from 'graphql-tag'

export const GET_ORDER_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionInput){
    getTransactions(input: $input) {
      id
      sysShop
      referenceNum
      merchantId
      paypandaRef
      userId
      name
      conno
      email
      address
      notes
      orderStatus
      dateDeclined
      dateFulfilled
      dateOrdered
      shopDetails {
        id
        shopname
        address
      }
      orderDetails {
        id
        addons
        productDetails {
          Id
          itemname
        }
      }
    }
  }
`
