import gql from 'graphql-tag';

export const GET_TRIP_BY_CONSUMER_USER_ID = gql`
  query getTripByConsumerUserId($input: GetTripByConsumerUserIdInput) {
    getTripByConsumerUserId(input: $input) {
      id
      status
      tag
      route {
        destinations {
          addressBreakdown {
            city
            province
          }
          formattedAddress
          location {
            latitude
            longitude
          }
        }
        origin {
          addressBreakdown {
            city
            province
          }
          formattedAddress
          location {
            latitude
            longitude
          }
        }
        distance {
          kilometer
        }
        duration {
          minute
        }
      }
    }
  }
`;
