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
  customerWallet: {},
  customerFranchisee: null,
  promotionVoucher: [],
  shippingVoucher: [],
  location: {},
  receiver: {},
  exhaust: {
    minutesRemaining: 0,
    showError: false,
    duration: 0,
  },
  loader: {
    isVisible: false,
    text: '',
    type: null,
  },
  scrollAnimation: [480, -480, 430],
  onBoarding: true
};

// [350, -350, 300]

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
    case 'SET_TOKTOKFOOD_CUSTOMER_WALLET_ACCOUNT':
      return {...state, customerWallet: action.payload};
    case 'SET_TOKTOKFOOD_CUSTOMER_FRANCHISEE':
      return {...state, customerFranchisee: action.payload};
    case 'SET_TOKTOKFOOD_SHOP_COORDINATES':
      return {...state, shopLocation: action.payload};
    case 'SET_TOKTOKFOOD_ORDER_RECEIVER':
      return {...state, receiver: action.payload};
    case 'SET_TOKTOKFOOD_PROMOTIONS':
      return {...state, promotionVoucher: action.payload};
    case 'SET_TOKTOKFOOD_SHIPPING':
      return {...state, shippingVoucher: action.payload};
    case 'SET_TOKTOKFOOD_EXHAUST':
      return {...state, exhaust: action.payload};
    case 'SET_TOKTOKFOOD_LOADER':
      return {...state, loader: action.payload};
    case 'SET_TOKTOKFOOD_SCROLL_ANIMATION':
      return {...state, scrollAnimation: action.payload};
    case 'SET_TOKTOKFOOD_ONBOARDING':
      return {...state, onBoarding: action.payload};
    default:
      return state;
  }
};
