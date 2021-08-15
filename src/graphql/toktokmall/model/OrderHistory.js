import gql from 'graphql-tag'

export const GET_ORDER_HISTORY = gql`
  query getOrderHistory($input: GetOrderHistoryInput) {
    getOrderHistory(input: $input) {
      orderId
      content
      action
      hasLink
      formatDate
      referenceNum
      image {
        filename
      }
      history {
        orderId
        content
        action
        hasLink
        formatDate
        referenceNum
        image {
          filename
        }
      }
    }
  }
`