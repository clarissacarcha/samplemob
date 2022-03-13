const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_APP_SERVICES':
      return {...state, ...action.payload};
    default:
      return state;
  }
};
