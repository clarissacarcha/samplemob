import gql from 'graphql-tag';

const Delivery = `
  id
  deliveryId
  tokConsumerId
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
`;

export const GET_DELIVERIES_AVAILABLE = gql`
  query getDeliveriesAvailable($filter: GetDeliveriesAvailableFilter) {
    getDeliveriesAvailable(filter: $filter) {
      ${Delivery}
    }
  }
`;
