import gql from 'graphql-tag';

const trip = `
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
cancellation {
  chargeAmount
  chargeType
  initiatedBy
  reason
}
`;

export const TRIP_BOOK = gql`
  mutation tripBook($input: TripBookInput!) {
    tripBook(input: $input) {
      message
      trip {
        ${trip}
      }
    }
  }
`;

export const GET_TRIPS_CONSUMER = gql`
  query getTripsConsumer($input: GetTripsConsumerInput!) {
    getTripsConsumer(input: $input) {
      ${trip}
    }
  }
`;

export const GET_TRIP_CANCELLATION_CHECK = gql`
  query getTripCancellationCheck($input: GetTripCancellationCheckInput!) {
    getTripCancellationCheck(input: $input) {
      chargeAmount
      chargeType
    }
  }
`;
export const TRIP_CONSUMER_CANCEL = gql`
mutation tripConsumerCancel ($input: TripConsumerCancelInput!){
  tripConsumerCancel (input: $input){
    ${trip}
  }
}
`;
export const TRIP_INITIALIZE_PAYMENT = gql`
  mutation tripInitializePayment($input: TripInitializePaymentInput) {
    tripInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;
