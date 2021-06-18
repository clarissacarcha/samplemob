const INITIAL_STATE = {
  user: {
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOKFOOD_LOCATION':
      return {...state.user, location: action.payload};
    default:
      return state;
  }
};
