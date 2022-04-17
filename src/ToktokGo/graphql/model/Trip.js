import gql from 'graphql-tag';

export const GET_TRIPS_CONSUMER = gql`
  query getTripsConsumer($input: GetTripsConsumerInput!) {
    getTripsConsumer(input: $input) {
      id
      status
      tag
      notes
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
        bounds {
          northeast {
            latitude
            longitude
          }
          southwest {
            latitude
            longitude
          }
        }
        legs {
          steps {
            polyline {
              points
            }
          }
        }
      }
      driver {
        name
        mobileNumber
        rating
        vehicle {
          license
          make
          model
          year
          bodyColor
          type {
            id
            name
          }
        }
      }
      fare {
        amount
        discount
        durationFee
        flatRate
        mileageFee
        total
      }
      logs {
        createdAt
        status
      }
      passengerCount
      paymentMethod
    }
  }
`;
