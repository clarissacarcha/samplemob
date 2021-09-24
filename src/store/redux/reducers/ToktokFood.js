const INITIAL_STATE = {
  user: {
    categories: [],
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  },
  shops: [],
  shopLocation: {
    latitude: 0.0,
    longitude: 0.0,
  },
  cart: [],
  totalAmount: {},
  orderStatus: {status: 1},
  customerInfo: {},
  location: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOKFOOD_CATEGORIES':
      return {...state, categories: action.payload};
    case 'SET_TOKTOKFOOD_LOCATION':
      return {...state, location: action.payload};
    case 'SET_TOKTOKFOOD_CART_ITEMS':
      return {...state, cart: action.payload};
    case 'SET_TOKTOKFOOD_CART_TOTAL':
      return {...state, totalAmount: action.payload};
    case 'SET_TOKTOKFOOD_SHOPS':
      return {...state, shops: action.payload};
    case 'SET_TOKTOKFOOD_ACCOUNT_INFO':
      return {...state, accountInfo: action.payload};
    case 'SET_TOKTOKFOOD_CUSTOMER_INFO':
      return {...state, customerInfo: action.payload};
    case 'SET_TOKTOKFOOD_SHOP_COORDINATES':
      return {...state, shopLocation: action.payload};
    default:
      return state;
  }
};
