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
  landmark
  notes
  orderStatus
  dateDeclined
  dateFulfilled
  dateOrdered
  actualAmount
  actualTotalamount
  totalAmount
  deliveryAmount
  originalShippingFee
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
  declinedNote
  srpTotalamount
  shopDetails {
    id
    shopname
    address
    logo
    latitude
    longitude
  }
  orderDetails {
    id
    basePrice
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
    totalAmountWithAddons
    resellerDiscount
    productDetails {
      Id
      itemname
      filename
      parentProductId
      parentProductName
    }
  }
  promoDetails {
    id
    shopId
    shippingDiscountName
    shippingDiscountCode
    email
    orderRefnum
    paypandaRef
    isPercentage
    amount
    orderDate
    paymentDate
    status
    validUntil
  }
  deliveryLogs {
    status
    createdAt
  }
`;

// Add this once back end merge - refundTotal
const transactionRef = `
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
  landmark
  notes
  orderStatus
  dateDeclined
  dateFulfilled
  dateOrdered
  actualAmount
  actualTotalamount
  totalAmount
  deliveryAmount
  originalShippingFee
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
  declinedNote
  srpTotalamount
  promoDiscounts
  srpTotal
  resellerDiscountTotal
  refundTotal
  shopDetails {
    id
    shopname
    address
    logo
    latitude
    longitude
  }
  orderDetails {
    id
    basePrice
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
    totalAmountWithAddons
    resellerDiscount
    resellerRate
    isModified
    productDetails {
      Id
      itemname
      filename
      parentProductId
      parentProductName
    }
  }
  promoDetails {
    id
    shopId
    shippingDiscountName
    shippingDiscountCode
    email
    orderRefnum
    paypandaRef
    isPercentage
    amount
    orderDate
    paymentDate
    status
    validUntil
  }
  deliveryLogs {
    status
    createdAt
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
      ${transactionRef}
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
