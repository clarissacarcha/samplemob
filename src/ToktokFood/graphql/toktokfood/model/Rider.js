import gql from 'graphql-tag';

export const GET_RIDER = gql`
  query getRider($input: GetRiderInput) {
    getRider(input: $input) {
      id
      appSalesOrderId
      riderName
      riderConno
      riderPlatenum
      status
    }
  }
`;
export const GET_RIDER_DETAILS = gql`
  query getDeliveryDetails($input: DeliveryDetailsInput) {
    getDeliveryDetails(input: $input) {
      deliveryId
      distance
      duration
      driver {
        averageRating
        lastLatitude
        lastLongitude
        user {
          username
          person {
            firstName
            middleName
            lastName
            avatar
            avatarThumbnail
          }
        }

        vehicle {
          plateNumber
          brand {
            brand
          }
          model {
            model
          }
        }
      }
      deliveryLogs {
        status
        createdAt
      }
    }
  }
`;

export const GET_SHIPPING_FEE = gql`
  query getShippingFee($input: GetShippingFeeInput!) {
    getShippingFee(input: $input) {
      success
      price
      hash
      hash_price
    }
  }
`;

