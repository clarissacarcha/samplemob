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
  cargo
  notes
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
`;

export const GET_DELIVERIES = gql`
    query getDeliveries($filter: deliveryFilter) {
        getDeliveries(filter: $filter) {
            ${Delivery}
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
  mutation postDelivery($input: PostDeliveryInput) {
    postDelivery(input: $input)
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

export const PATCH_DELIVERY_REBOOK = gql`
  mutation patchDeliveryRebook($input: PatchDeliveryRebookInput!) {
    patchDeliveryRebook(input: $input)
  }
`;

export const PATCH_DELIVERY_INCREMENT_STATUS = gql`
  mutation patchDeliveryIncrementStatus($input: PatchDeliveryIncrementStatusInput!) {
    patchDeliveryIncrementStatus(input: $input) {
      ${Delivery}
    }
  }
`;

export const PATCH_DELIVERY_RATING = gql`
  mutation patchDeliveryRating($input: PatchDeliveryRatingInput!) {
    patchDeliveryRating(input: $input)
  }
`;
