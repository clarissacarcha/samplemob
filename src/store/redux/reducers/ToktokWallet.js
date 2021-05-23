const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOKWALLET_ACCOUNT':
      return {...state, ...action.payload};
    default:
      return state;
  }
};
