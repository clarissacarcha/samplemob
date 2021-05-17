import AsyncStorage from '@react-native-community/async-storage';

const INITIAL_STATE = {
  user: {
    person: {},
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CREATE_SESSION':
      console.log('CREATE_SESSION: ', JSON.stringify(action.payload, null, 4));
      return {...state, ...action.payload};
    case 'DESTROY_SESSION':
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('accessToken');
      // return INITIAL_STATE;
      return state;
    default:
      return state;
  }
};
