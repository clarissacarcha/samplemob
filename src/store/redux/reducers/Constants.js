const INITIAL_STATE = {
  paypandaMerchantId: '',
  paypandaTransactionEndpoint: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_CONSTANTS':
      return {...state, ...action.payload};
    default:
      return state;
  }
};
