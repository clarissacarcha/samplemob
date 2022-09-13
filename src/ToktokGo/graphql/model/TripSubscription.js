import gql from 'graphql-tag';

const trip = `
    consumer{
      mobileNumber
      name
    }
    consumerUserId
    driver{
      mobileNumber
      name
      rating
      vehicle{
        bodyColor
        plateNumber
        make
        model
      }
    }
    driverUserId
    fare{
      amount
      discount
      durationFee
      flatRate
      mileageFee
      surgeCharge
      total
      vouchers{
        name
      }
    }
    id
    logs{
      createdAt
      status
    }
    notes
    passengerCount
    paymentMethod
    route{
      bounds{
        northeast{
          latitude
          longitude
        }
        southwest{
          latitude
          longitude
        }
      }
      destinations{
        addressBreakdown{
          city
          country
          postal
          province
          region
        }
        formattedAddress
        location{
          latitude
          longitude
        }
      }
      distance{
        kilometer
        meter
      }
      duration{
        minute
        second
      }
      legs{
        steps{
          polyline{
            points
          }
        }
      }
      origin{
        addressBreakdown{
          city
          country
          postal
          province
          region
        }
        formattedAddress
        location{
          latitude
          longitude
        }
      }
    }
    status
    tag
    cancellation {
      initiatedBy
      reason
      charge {
        amount
        type
      }
    }
    estimates{
      dropOffTimeFrame
      pickUpAt
    }
    vehicleType {
      imageClass
      name
    }
`;

export const ON_TRIP_UPDATE = gql`
subscription onTripUpdate ($consumerUserId: ID) {
  onTripUpdate(consumerUserId: $consumerUserId) {
      ${trip}
    }
  }
`;
