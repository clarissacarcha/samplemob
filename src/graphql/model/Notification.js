import gql from 'graphql-tag';

const Delivery = `
  id
  tokConsumerId
  distance
  duration
  price
  comRate
  cashOnDelivery
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

export const GET_NOTIFICATIONS = gql`
  query getNotifications($input: GetNotificationsInput!) {
    getNotifications(input: $input) {
      id
      title
      body
      status
      createdAt
      tokUserId
      tokDeliveryId
      delivery {
        ${Delivery}
      }
    }
  }
`;
