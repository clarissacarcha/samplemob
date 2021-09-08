import gql from 'graphql-tag'

const transaction = `
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
  tDeliveryId
  tShareLink
  isconfirmed
  deliveryImgurl
  deliveryImgurl2
  orderIsfor
  shopDetails {
    id
    shopname
    address
    logo
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
      filename
    }
  }
`
export const GET_ORDER_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionInput){
    getTransactions(input: $input) {
      ${transaction}
    }
  }
`
export const GET_ORDER_TRANSACTION_BY_ID = gql`
  query getTransactionById($input: GetTransactionByIdInput){
    getTransactionById(input: $input) {
      ${transaction}
    }
  }
`
