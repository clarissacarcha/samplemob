import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
  query getMessages($input: GetMessagesInput!) {
    getMessages(input: $input) {
      id
      title
      body
      status
      createdAt
      tokUserId
      tokDeliveryId
      delivery {
        id
        tokConsumerId
        distance
        duration
        price
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
            }
          }
        }
      }
    }
  }
`;
