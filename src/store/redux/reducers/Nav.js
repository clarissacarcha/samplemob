const INITIAL_STATE = {
  authenticated: true,
  unauthenticated: true,
  postRegistration: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {...state, authenticated: action.payload.show};
    case 'SET_UNAUTHENTICATED':
      return {...state, unauthenticated: action.payload.show};
    case 'SET_POST_REGISTRATION':
      return {...state, postRegistration: action.payload.show};
    default:
      return state;
  }
};
