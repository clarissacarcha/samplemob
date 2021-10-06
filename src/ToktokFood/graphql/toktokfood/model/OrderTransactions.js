import gql from 'graphql-tag';

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
  dateCancelled
  dateCancelledDeclined
  tDeliveryId
  tShareLink
  isconfirmed
  deliveryImgurl
  deliveryImgurl2
  orderIsfor
  isdeclined
  latitude
  longitude
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
    notes
    productDetails {
      Id
      itemname
      filename
      parentProductId
      parentProductName
    }
  }
`;
export const GET_ORDER_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionInput){
    getTransactions(input: $input) {
      ${transaction}
    }
  }
`;
export const GET_ORDER_TRANSACTION_BY_REF_NUM = gql`
  query getTransactionByRefNum($input: GetTransactionByRefNumInput){
    getTransactionByRefNum(input: $input) {
      ${transaction}
    }
  }
`;

export const PATCH_PLACE_CUSTOMER_ORDER = gql`
  mutation checkoutOrder($input: CheckOutOrderInput!) {
    checkoutOrder(input: $input) {
      status
      message
      referenceNum
    }
  }
`;

export const PATCH_CANCEL_CUSTOMER_ORDER = gql`
  mutation cancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      status
      message
    }
  }
`;
