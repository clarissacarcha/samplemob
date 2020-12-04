const INITIAL_STATE = {
  loading: false,
  backgroundLocation: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return {...state, loading: true};
    case 'FINISH_LOADING':
      return {...state, loading: false};
    case 'START_BACKGROUND_LOCATION':
      console.log('STARTING BACKGROUND LOCATION');
      return {...state, backgroundLocation: true};
    case 'END_BACKGROUND_LOCATION':
      return {...state, backgroundLocation: false};
    default:
      return state;
  }
};
