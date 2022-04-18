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
        consumer {
          mobileNumber
          name
        }
        consumerUserId
        dispatchHash
        driver {
          mobileNumber
          name
          rating
          vehicle {
            bodyColor
            license
            make
            model
            type {
              id
              name
            }
            year
          }
        }
        driverUserId
        fare {
          amount
          discount
          durationFee
          flatRate
          mileageFee
          total
        }
        id
        logs {
          createdAt
          status
        }
        notes
        passengerCount
        paymentMethod
        route {
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
          destinations {
            addressBreakdown {
              city
              country
              postal
              province
              region
            }
            formattedAddress
            location {
              latitude
              longitude
            }
          }
          distance {
            kilometer
            meter
          }
          duration {
            minute
            second
          }
          legs {
            steps {
              polyline {
                points
              }
            }
          }
          origin {
            addressBreakdown {
              city
              country
              postal
              province
              region
            }
            formattedAddress
            location {
              latitude
              longitude
            }
          }
        }
        status
        tag
      }
    }
  }
`;
