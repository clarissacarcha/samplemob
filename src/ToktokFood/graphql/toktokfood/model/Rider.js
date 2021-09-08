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
  query getDriver($input: GetDriverInput) {
    getDriver(input: $input) {
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

