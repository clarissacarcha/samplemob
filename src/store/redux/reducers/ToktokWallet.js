const INITIAL_STATE = {
  person: {
    accountType: {
      level: 0,
      type: '',
      key: '',
    },
  },
  wallet: {
    id: 0,
    balance: 0,
    creditCardBalance: 0,
    status: 0,
    accountId: 0,
    motherId: 0,
    currencyId: 0,
    currency: {
      id: 0,
      name: '',
      code: '',
      phpValue: 0,
    },
    recentTransactions: [],
    allTransactions: [],
  },
  globalSettings: null,
  loading: false,
  events: {
    upgradeAccount: false,
    cashInTopUp: false,
  },
  constants: {},
  contacts: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, loading: action.payload};
    case 'SET_TOKTOKWALLET_ACCOUNT':
      return {...state, ...action.payload};
    case 'SET_TOKTOKWALLET_TRANSACTIONS':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          currency: {...state.wallet.currency},
          allTransactions: action.payload.allTransactions,
          recentTransactions: action.payload.recentTransactions,
        },
      };
    case 'SET_REFRESH_TOKTOKWALLET':
      const payload = action.payload;
      return {
        ...state,
        wallet: {
          ...state.wallet,
          currency: {...state.wallet.currency},
          balance: +payload.wallet.balance,
          creditCardBalance: +payload.wallet.creditCardBalance,
          transferableBalance: +payload.wallet.transferableBalance,
          recentTransactions: payload.transactions.recentTransactions,
          allTransactions: payload.transactions.allTransactions,
        },
      };
    case 'SET_TOKWA_EVENTS_REDIRECT':
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.event]: action.payload.value,
        },
      };
    case 'SET_TOKWA_CONSTANTS':
      return {
        ...state,
        constants: {
          ...state.constants,
          ...action.payload,
        },
      };
    case 'SET_CONTACTS':
      return {
        ...state,
        contacts: [...action.payload],
      };
    case 'SET_TOKWA_TO_INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
};
