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
    vehicleType: {
      id: null,
      name: null,
      phrase: null,
    },
    rate: {
      amount: null,
      flatRate: null,
      mileageFee: null,
    },
    noteToDriver: null,
    paymentMethod: null,
    passengerCount: 1,
  },
  route: {
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
      return {...state, route: action.payload};
    case 'SET_TOKTOKGO_BOOKING_INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
};
