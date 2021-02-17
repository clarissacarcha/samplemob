import gql from 'graphql-tag';

export const ON_DELIVERY_DISPATCH = gql`
  subscription onDeliveryDispatch($userId: String!) {
    onDeliveryDispatch(userId: $userId) {
      delivery {
        id
        distance
        duration
        price
        senderStop {
          name
          formattedAddress
        }
        recipientStop {
          name
          formattedAddress
        }
      }
    }
  }
`;
