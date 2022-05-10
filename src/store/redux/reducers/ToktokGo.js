import uuid from 'react-native-uuid';

const INITIAL_STATE = {
  sessionToken: uuid.v4(),
  origin: {
    hash: null,
    name: null,
    place: {
      formattedAddress: null,
      location: {
        latitude: null,
        longitude: null,
      },
      addressBreakdown: {
        city: null,
        province: null,
        region: null,
        country: null,
        postal: null,
      },
    },
  },
  destination: {
    hash: null,
    name: null,
    place: {
      formattedAddress: null,
      location: {
        latitude: null,
        longitude: null,
      },
      addressBreakdown: {
        city: null,
        province: null,
        region: null,
        country: null,
        postal: null,
      },
    },
  },
  details: {
    id: null,
    status: null,
    tag: null,
    vehicleType: {
      id: null,
      name: null,
      phrase: null,
      imageClass: null,
      availableSeats: null,
    },
    rate: {
      hash: null,
      tripFare: {
        durationFee: null,
        flatRate: null,
        mileageFee: null,
        discount: null,
        total: null,
      },
    },
    voucher: null,
    noteToDriver: null,
    paymentMethod: 2,
    passengerCount: 1,
  },
  routeDetails: {
    hash: null,
    distance: {
      killometer: null,
    },
    duration: {
      minute: null,
    },
    bounds: {
      northeast: {
        latitude: null,
        longitude: null,
      },
      southWest: {
        latitude: null,
        longitude: null,
      },
    },
    legs: {
      steps: [],
    },
  },
  paymentMethod: 'CASH',
  booking: {
    id: null,
    dispatchHash: null,
    status: null,
    tag: null,
    notes: null,
    route: {
      destinations: [
        {
          addressBreakdown: {
            city: null,
            province: null,
          },
          formattedAddress: null,
          location: {
            latitude: null,
            longitude: null,
          },
        },
      ],
      origin: {
        addressBreakdown: {
          city: null,
          province: null,
        },
        formattedAddress: null,
        location: {
          latitude: null,
          longitude: null,
        },
      },
      distance: {
        kilometer: null,
      },
      duration: {
        minute: null,
      },
      bounds: {
        northeast: {
          latitude: null,
          longitude: null,
        },
        southwest: {
          latitude: null,
          longitude: null,
        },
      },
      legs: {
        steps: {
          polyline: {
            points: null,
          },
        },
      },
    },
    paymentMethod: 'CASH',
    consumer: {
      name: null,
      mobileNumber: null,
    },
    fare: {
      amount: null,
      discount: null,
      durationFee: null,
      flatRate: null,
      mileageFee: null,
      total: null,
    },
    logs: [],
    cancellation: {
      chargeAmount: null,
      chargeType: null,
      initiatedBy: null,
      reason: null,
    },
  },
  tempVehicleArr: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOKGO_BOOKING_SESSION_TOKEN':
      return {...state, sessionToken: action.payload};
    case 'SET_TOKTOKGO_BOOKING_ORIGIN':
      return {...state, origin: action.payload};
    case 'SET_TOKTOKGO_BOOKING_DESTINATION':
      return {...state, destination: action.payload};
    case 'SET_TOKTOKGO_BOOKING_DETAILS':
      return {...state, details: action.payload};
    case 'SET_TOKTOKGO_BOOKING_ROUTE':
      return {...state, routeDetails: action.payload};
    case 'SET_TOKTOKGO_BOOKING':
      return {...state, booking: action.payload};
    case 'SET_TOKTOKGO_TEMP_VEHICLE_LIST':
      return {...state, tempVehicleArr: action.payload};
    case 'SET_TOKTOKGO_BOOKING_INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
};
