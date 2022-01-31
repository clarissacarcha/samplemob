import gql from 'graphql-tag';

const Delivery = `
  id
  deliveryId
  tokConsumerId
  tokDriverId
  distance
  duration
  price
  expressFee
  comRate
  cashOnDelivery
  collectPaymentFrom
  discount
  isDiscountPayable
  isDiscountProcessed
  isDiscountExported
  cargo
  notes
  description
  status
  createdAt
  senderStop {
    name
    mobile
    landmark
    formattedAddress
    latitude
    longitude
    orderType
    scheduledFrom
    scheduledTo
  }
  recipientStop {
    name
    mobile
    landmark
    formattedAddress
    latitude
    longitude
    orderType
    scheduledFrom
    scheduledTo
  }
  logs {
    status
    image
    createdAt
  }
  driver {
    id
    user {
      username
      person {
        firstName
        lastName
        avatar
        avatarThumbnail
      }
    }
  }
  driverRating {
    rating
    feedback
    createdAt
  }
  consumerRating {
    rating
    feedback
    createdAt
  }
  vehicleType {
    name
  }
`;

export const GET_DELIVERIES = gql`
    query getDeliveries($filter: deliveryFilter) {
        getDeliveries(filter: $filter) {
            ${Delivery}
        }
    }
`;

export const GET_DELIVERY_PRICE_AND_DIRECTIONS = gql`
  query getDeliveryPriceAndDirections($input: GetDeliveryPriceAndDirectionsInput!) {
    getDeliveryPriceAndDirections(input: $input) {
      hash
      pricing {
        price
        discount
        expressFee
        distance
        duration
      }
      directions {
        bounds {
          northeast {
            latitude
            longitude
          }
          southwest {
            latitude
            longitude
          }
        }
        legs {
          startAddress
          endAddress
          startLocation {
            latitude
            longitude
          }
          endLocation {
            latitude
            longitude
          }
          polyline {
            latitude
            longitude
          }
        }
      }
    }
  }
`;

export const GET_DELIVERY_LOCATION_FILTERS = gql`
  query {
    getDeliveryLocationFilters
  }
`;

export const GET_DELIVERIES_COUNT_BY_STATUS = gql`
  query getDeliveriesCountByStatus($filter: deliveryFilter) {
    getDeliveriesCountByStatus(filter: $filter) {
      status
      count
    }
  }
`;

export const POST_DELIVERY = gql`
  mutation postDelivery($input: PostDeliveryInput!) {
    postDelivery(input: $input) {
      message
    }
  }
`;

export const PATCH_DELIVERY_ACCEPTED = gql`
  mutation patchDeliveryAccepted($input: PatchDeliveryAcceptedInput!) {
    patchDeliveryAccepted(input: $input) {
      ${Delivery}
    }
  }
`;

export const PATCH_DELIVERY_CUSTOMER_CANCEL = gql`
  mutation patchDeliveryCustomerCancel($input: PatchDeliveryCustomerCancelInput!) {
    patchDeliveryCustomerCancel(input: $input) {
      ${Delivery}
    }
  }
`;

export const PATCH_DELIVERY_DRIVER_CANCEL = gql`
  mutation patchDeliveryDriverCancel($input: PatchDeliveryDriverCancelInput!) {
    patchDeliveryDriverCancel(input: $input) {
        ${Delivery}
    }
  }
`;

export const PATCH_DELIVERY_DELETE = gql`
  mutation patchDeliveryDelete($input: PatchDeliveryDeleteInput!) {
    patchDeliveryDelete(input: $input)
  }
`;

export const PATCH_DELIVERY_INCREMENT_STATUS = gql`
  mutation patchDeliveryIncrementStatus($input: PatchDeliveryIncrementStatusInput!) {
    patchDeliveryIncrementStatus(input: $input) {
      ${Delivery}
    }
  }
`;

export const PATCH_DELIVERY_ON_THE_WAY_TO_SENDER = gql`
  mutation {
    patchDeliveryOnTheWayToSender(input: {delivery: {}}) {
      id
    }
  }
`;

export const ON_DELIVERY_STATUS_CHANGE = gql`
  subscription onDeliveryStatusChange($input: OnDeliveryStatusChangeInput!) {
    onDeliveryStatusChange(input: $input) {
      message
      delivery {
        ${Delivery}
      }
    }
  }
`;

export const ON_DELIVERY_ACCEPTED = gql`
  subscription onDeliveryAccepted($input: OnDeliveryAcceptedInput!) {
    onDeliveryAccepted(input: $input) {
      message
      delivery {
        ${Delivery}
      }
    }
  }
`;

export const POST_DELIVERY_REQUEST_TAKE_MONEY = gql`
  mutation postDeliveryRequestTakeMoney($input: PostDeliveryRequestTakeMoneyInput!) {
    postDeliveryRequestTakeMoney(input: $input) {
      message
      requestTakeMoneyId
      validator
    }
  }
`;

export const POST_DELIVERY_VERIFY_REQUEST_TAKE_MONEY = gql`
  mutation postDeliveryVerifyRequestTakeMoney($input: PostDeliveryVerifyRequestTakeMoneyInput!) {
    postDeliveryVerifyRequestTakeMoney(input: $input) {
      message
    }
  }
`;
