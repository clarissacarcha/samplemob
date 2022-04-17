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

export const TRIP_BOOK = gql`
  mutation tripBook($input: TripBookInput!) {
    tripBook(input: $input) {
      message
      trip {
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
  }
`;
