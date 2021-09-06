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
      totalAmount
      deliveryAmount
      paymentMethod
      dateAssigned
      dateOrdered
      dateOrderProcessed
      dateReadyPickup
      dateBookingConfirmed
      dateFulfilled
      dateReturntosender
      dateRedeliver
      dateShipped
      dateReceived
      tDeliveryid
      tShareLink
      isconfirmed
      shopDetails {
        id
        shopname
        address
      }
      orderDetails {
        id
        orderId
        productId
        quantity
        srpAmount
        srpTotalamount
        amount
        totalAmount
        refcomTotalamount
        refcomRate
        orderType
        addons
        status
        exrateNToPhp
        exratePhpToN
        currency
        curcode
        productDetails {
          Id
          itemname
        }
      }
    }
  }
`
export const GET_ORDER_TRANSACTION_BY_REF_NUM = gql`
  query getTransactionByRefNum($input: GetTransactionByRefNumInput){
    getTransactionByRefNum(input: $input) {
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
      totalAmount
      deliveryAmount
      paymentMethod
      dateAssigned
      dateOrdered
      dateOrderProcessed
      dateReadyPickup
      dateBookingConfirmed
      dateFulfilled
      dateReturntosender
      dateRedeliver
      dateShipped
      dateReceived
      tDeliveryid
      tShareLink
      isconfirmed
      shopDetails {
        id
        shopname
        address
      }
      orderDetails {
        id
        orderId
        productId
        quantity
        srpAmount
        srpTotalamount
        amount
        totalAmount
        refcomTotalamount
        refcomRate
        orderType
        addons
        status
        exrateNToPhp
        exratePhpToN
        currency
        curcode
        productDetails {
          Id
          itemname
        }
      }
    }
  }
`
