import gql from 'graphql-tag';

export const GET_TOKTOKFOOD_NOTIFICATIONS = gql`
  query getToktokFoodNotifications($input: UserNotificationInput!) {
    getToktokFoodNotifications(input: $input) {
      id
      branchId
      shopId
      userId
      orderStatus
      referenceNum
      status
    }
  }
`;
