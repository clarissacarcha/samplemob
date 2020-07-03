import gql from 'graphql-tag';

export const GET_ORDERS = gql`
  query getNearestOrderAvailable($filter: nearestFilter) {
    getNearestOrderAvailable(filter: $filter) {
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
    }
  }
`;
