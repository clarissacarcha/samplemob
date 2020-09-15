const INITIAL_STATE = {
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return {...state, loading: true};
    case 'FINISH_LOADING':
      return {...state, loading: false};
    default:
      return state;
  }
};
