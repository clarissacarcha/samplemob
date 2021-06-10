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
    }
}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOKWALLET_ACCOUNT':
      return {...state, ...action.payload};
    default:
      return state;
  }
};
