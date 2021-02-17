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

export const POST_DELIVERY_CANCELLATION = gql`
  mutation postDeliveryCancellation($input: PostDeliveryCancellationInput!) {
    postDeliveryCancellation(input: $input) {
      ${Delivery}
    }
  }
`;
