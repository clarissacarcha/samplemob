import gql from 'graphql-tag';

export const GET_QUOTATION = gql`
  query getQuotation($input: GetQuotationInput!) {
    getQuotation(input: $input) {
      quotation {
        route {
          hash
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
        vehicleTypeRates {
          hash
          vehicleType {
            id
            name
            phrase
            imageClass
            availableSeats
          }
          rate {
            amount
            flatRate
            mileageFee
            durationFee
          }
        }
      }
    }
  }
`;

export const GET_TRIP_FARE = gql`
  query getTripFare($input: GetTripFareInput!) {
    getTripFare(input: $input) {
      hash
      tripFare {
        flatRate
        mileageFee
        durationFee
        discount
        total
      }
    }
  }
`;
