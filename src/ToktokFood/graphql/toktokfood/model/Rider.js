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
  query getDeliveryDriver($input: GetDeliveryDriverInput) {
    getDeliveryDriver(input: $input) {
      driver {
        id
        status
        licenseNumber
        isOnline
        location {
          latitude
          longitude
          lastUpdate
        }
        user {
          id
          username
          status
          person {
            firstName
            middleName
            lastName
            mobileNumber
            emailAddress
            avatar
            avatarThumbnail
          }
        }
        vehicle{
          plateNumber
          brand {
            brand
          }
          model {
            model
          }
        }
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

