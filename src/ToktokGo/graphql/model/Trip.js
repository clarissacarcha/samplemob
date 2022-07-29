import gql from 'graphql-tag';

const trip = `
consumer {
  mobileNumber
  name
}
consumerUserId
driver {
  mobileNumber
  name
  rating
  vehicle {
    bodyColor
    plateNumber
    make
    model
  }
}
driverUserId
fare {
  amount
  discount
  durationFee
  flatRate
  mileageFee
  surgeCharge
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

export const GET_TRIP = gql`
query getTrip($input: GetTripInput) {
  getTrip(input: $input) {
    ${trip}
  }
}
`;

export const GET_TRIPS_CONSUMER = gql`
  query getTripsConsumer($input: GetTripsConsumerInput) {
    getTripsConsumer(input: $input) {
      ${trip}
    }
  }
`;

export const GET_TRIP_CANCELLATION_CHARGE = gql`
  query getTripCancellationCharge($input: GetTripCancellationChargeInput!) {
    getTripCancellationCharge(input: $input) {
      amount
      type
      hash
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
  mutation tripInitializePayment($input: TripInitializePaymentInput!) {
    tripInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;

export const TRIP_REBOOK = gql`
  mutation tripRebook($input: TripRebookInput!) {
    tripRebook(input: $input) {
      message
      trip{
        ${trip}
      }
    }
  }
`;

export const TRIP_REBOOK_INITIALIZE_PAYMENT = gql`
  mutation tripRebookInitializePayment($input: TripRebookInitializePaymentInput!) {
    tripRebookInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;

export const TRIP_CHARGE_INITIALIZE_PAYMENT = gql`
  mutation tripChargeInitializePayment($input: TripChargeInitializePaymentInput!) {
    tripChargeInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;

export const TRIP_CHARGE_FINALIZE_PAYMENT = gql`
  mutation tripChargeFinalizePayment($input: TripChargeFinalizePaymentInput!) {
    tripChargeFinalizePayment(input: $input) {
      message
      trip {
        ${trip}
      }
    }
  }
`;
