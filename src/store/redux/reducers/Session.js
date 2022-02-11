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
    case 'UPDATE_TOKWA_ACCOUNT_ID_SESSION':
      return {...state, user: {...state.user,toktokWalletAccountId: action.payload,}};
    case 'UPDATE_TOKTOK_PERSON_VIA_TOKTOKWALLET_INFO':
      return {...state, 
        user: {
          ...state.user,
          person: {
            ...state.user.person,
            firstName: action.payload.firstName,
            middleName: action.payload.middleName,
            lastName: action.payload.lastName,
            emailAddress: action.payload.emailAddress,
            birthdate: action.payload.birthdate,
          }
        }
     };
    case 'DESTROY_SESSION':
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('accessToken');
      // return INITIAL_STATE;
      return state;
    default:
      return state;
  }
};
