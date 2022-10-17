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
  vouchers{
    name
  }
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
cancellationChargeStatus
`;

const DriverData = `
driver {
  licenseNumber
  goAverageRating
  overallAverageRating
  user {
    username
    person {
      firstName
      middleName
      lastName
      mobileNumber
      avatar
      avatarThumbnail
      covidVaccinationStatus {
        description
      }
    }
  }
}`;

export const GO_TRIP_BOOK = gql`
  mutation goTripBook($input: TripBookInput!) {
    goTripBook(input: $input) {
      message
      trip {
        ${trip}
      }
    }
  }
`;

export const GO_GET_TRIP = gql`
query goGetTrip($input: GetTripInput) {
  goGetTrip(input: $input) {
    ${trip}
  }
}
`;

export const GO_GET_TRIPS_CONSUMER = gql`
  query goGetTripsConsumer($input: GetTripsConsumerInput) {
    goGetTripsConsumer(input: $input) {
      ${trip}
    }
  }
`;

export const GO_GET_TRIP_CANCELLATION_CHARGE = gql`
  query goGetTripCancellationCharge($input: GetTripCancellationChargeInput!) {
    goGetTripCancellationCharge(input: $input) {
      amount
      type
      hash
    }
  }
`;

export const GET_BOOKING_DRIVER = gql`
  query getBookingDriver($input: GetBookingDriverInput!) {
    getBookingDriver(input: $input) {
      ${DriverData}
    }
  }
`;

export const GO_TRIP_CONSUMER_CANCEL = gql`
mutation goTripConsumerCancel ($input: TripConsumerCancelInput!){
  goTripConsumerCancel (input: $input){
    ${trip}
  }
}
`;
export const GO_TRIP_INITIALIZE_PAYMENT = gql`
  mutation goTripInitializePayment($input: TripInitializePaymentInput!) {
    goTripInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;

export const GO_TRIP_REBOOK = gql`
  mutation goTripRebook($input: TripRebookInput!) {
    goTripRebook(input: $input) {
      message
      trip{
        ${trip}
      }
    }
  }
`;

export const GO_TRIP_REBOOK_INITIALIZE_PAYMENT = gql`
  mutation goTripRebookInitializePayment($input: TripRebookInitializePaymentInput!) {
    goTripRebookInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;

export const GO_TRIP_CHARGE_INITIALIZE_PAYMENT = gql`
  mutation goTripChargeInitializePayment($input: TripChargeInitializePaymentInput!) {
    goTripChargeInitializePayment(input: $input) {
      hash
      validator
    }
  }
`;

export const GO_TRIP_CHARGE_FINALIZE_PAYMENT = gql`
  mutation goTripChargeFinalizePayment($input: TripChargeFinalizePaymentInput!) {
    goTripChargeFinalizePayment(input: $input) {
      message
      trip {
        ${trip}
      }
    }
  }
`;

export const DRIVER_RATING = gql`
  mutation postGoDriverRating($input: PostGoDriverRatingInput!) {
    postGoDriverRating(input: $input) {
      message
    }
  }
`;

export const GO_GET_TRIP_SUPPLY = gql`
  query goGetTripSupply($input: GetTripSupplyInput!) {
    goGetTripSupply(input: $input) {
      location {
        latitude
        longitude
      }
    }
  }
`;
