const INITIAL_STATE = {
  defaultAddress: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOK_DEFAULT_ADDRESS':
      return {...state, defaultAddress: action.payload};
    default:
      return state;
  }
};
