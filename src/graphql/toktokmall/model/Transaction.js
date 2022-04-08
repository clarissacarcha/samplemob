import gql from 'graphql-tag'

export const GET_TRANSACTIONS = gql`
  query getActvities($input: getActivitiesInput) {
    getActivities(input: $input) {
      id
      referenceNum
      dateOrdered
      totalAmount
      orderStatus
      orderType
      orderIds
      shopIds
      status
      orders {
        orderId
        shopId
        shopName
        totalItems
        items {
          productId
        }
      }
      history
    }
  }
`

export const GET_CONFIRMED_TRANSACTIONS = gql`
	query getConfirmedTransactions($input: GetOrdersInput){
    getConfirmedTransactions(input: $input){
      id
      userId
      referenceNum
      orderTotal
      orderPlaced
      items {
        shop {
          id
          shopname
        }
        shipping {
          deliveryAmount
          daystoship
          daystoshipTo
          orderPlaced
          receiveBy
        }
        products {
          data {
            quantity
            totalAmount
            product {
              Id
              itemname
              name
              variant
              price
              compareAtPrice
              enabled
              img {
                filename
              }
            }
          }        
        }
      }
    }
  }
`

export const GET_TOSHIP_TRANSACTIONS = gql`
	query getToShipTransactions($input: GetOrdersInput){
    getToShipTransactions(input: $input){
      id
      userId
      referenceNum
      orderTotal
      orderPlaced
      items {
        shop {
          id
          shopname
        }
        shipping {
          deliveryAmount
          daystoship
          daystoshipTo
          orderPlaced
          receiveBy
        }
        products {
          data {
            quantity
            totalAmount
            product {
              Id
              itemname
              name
              variant
              price
              compareAtPrice
              enabled
              img {
                filename
              }
            }
          }        
        }
      }
    }
  }
`

export const GET_TORECEIVE_TRANSACTIONS = gql`
	query getToReceiveTransactions($input: GetOrdersInput){
    getToReceiveTransactions(input: $input){
      id
      userId
      referenceNum
      orderTotal
      orderPlaced
      items {
        shop {
          id
          shopname
        }
        shipping {
          deliveryAmount
          daystoship
          daystoshipTo
          orderPlaced
          receiveBy
        }
        products {
          data {
            quantity
            totalAmount
            product {
              Id
              itemname
              name
              variant
              price
              compareAtPrice
              enabled
              img {
                filename
              }
            }
          }        
        }
      }
    }
  }
`

export const GET_COMPLETED_TRANSACTIONS = gql`
	query getCompletedTransactions($input: GetOrdersInput){
    getCompletedTransactions(input: $input){
      id
      userId
      referenceNum
      orderTotal
      orderPlaced
      orderReceived
      items {
        shop {
          id
          shopname
        }
        shipping {
          deliveryAmount
          daystoship
          daystoshipTo
          orderPlaced
          receiveBy
        }
        products {
          data {
            quantity
            totalAmount
            product {
              Id
              itemname
              name
              variant
              price
              compareAtPrice
              enabled
              img {
                filename
              }
            }
          }        
        }
      }
    }
  }
`