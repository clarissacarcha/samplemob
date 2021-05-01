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
    addressBreakdown {
      city
      province
    }
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
    addressBreakdown {
      city
      province
    }
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
