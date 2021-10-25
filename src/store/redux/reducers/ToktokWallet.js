const INITIAL_STATE = {
  person: {
    accountType: {
      level: 0,
      type: "",
      key: "",
    }
  },
  wallet: {
    id: 0,
    balance: 0,
    status: 0,
    accountId: 0,
    motherId: 0,
    currencyId: 0,
    currency: {
        id: 0,
        name: "",
        code: "",
        phpValue: 0
    },
    recentTransactions: [],
    allTransactions: [],
  },
  globalSettings: null,
  loading: false,
  events: {
    upgradeAccount: false,
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, loading: action.payload}
    case 'SET_TOKTOKWALLET_ACCOUNT':
      return {...state, ...action.payload};
    case 'SET_TOKTOKWALLET_TRANSACTIONS':
      return {
        ...state, 
        wallet: {
          ...state.wallet, 
          currency: {...state.wallet.currency}, 
          allTransactions: action.payload.allTransactions,
          recentTransactions: action.payload.recentTransactions} 
        }
    case 'SET_REFRESH_TOKTOKWALLET':
      const payload = action.payload
      return {
        ...state , 
        wallet: {
          ...state.wallet,
          currency: {...state.wallet.currency},  
          balance: +payload.wallet.balance , 
          recentTransactions: payload.transactions.recentTransactions, 
          allTransactions: payload.transactions.allTransactions,
        }
      }
    case 'SET_TOKWA_EVENTS_REDIRECT':
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.event]: action.payload.value
        }
      }
    default:
      return state;
  }
};
