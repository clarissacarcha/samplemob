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
            flatRate
            perKm
            perMin
            maxSurgeCharge
          }
          rate {
            amount
            flatRate
            mileageFee
            durationFee
            surgeCharge
          }
        }
      }
    }
  }
`;

export const GO_GET_TRIP_FARE = gql`
  query goGetTripFare($input: GetTripFareInput!) {
    goGetTripFare(input: $input) {
      charge {
        amount
        type
        createdAt
      }
      hash
      tripFare {
        amount
        discount
        durationFee
        flatRate
        mileageFee
        surgeCharge
        total
      }
      initialDropOffTimeFrame
    }
  }
`;
