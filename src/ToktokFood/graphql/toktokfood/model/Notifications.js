import gql from 'graphql-tag';

export const GET_TOKTOKFOOD_NOTIFICATIONS = gql`
  query getToktokFoodNotifications {
    getToktokFoodNotifications {
      id
      branchId
      shopId
      userId
      orderStatus
      status
    }
  }
`;
