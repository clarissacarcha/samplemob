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

export const GET_ORDERS_AND_HISTORY = gql`
  query getOrdersAndHistory($input: GetOrdersAndHistoryInput) {
    getOrdersAndHistory(input: $input) {
      uuid
      id
      referenceNum
      history {
        uuid
        orderId
        content
        action
        hasLink
        statusText
        formatDate
        formatTime
        referenceNum      
      }
      product {
        image {
          filename
        }
      }
      parent {
	  		description
        date
      }
    }
  }
`