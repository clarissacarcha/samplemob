import gql from 'graphql-tag';

export const GET_TRIP = gql`
  query getTrip($input: GetTripInput) {
    getTrip(input: $input) {
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
