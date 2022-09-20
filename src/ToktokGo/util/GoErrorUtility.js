import {Alert} from 'react-native';
import {ApolloError} from 'apollo-client';
import {navigate, replace} from 'src/app/Nav/RootNavigation';
import {useAlertGO} from '../hooks';
const alertGO = useAlertGO();

export const onError = error => {
  const {graphQLErrors, networkError} = error;

  if (networkError) {
    Alert.alert('', 'Network error occurred. Please check your internet connection.');
  } else if (graphQLErrors.length > 0) {
    graphQLErrors.map(({message, locations, path, code}) => {
      if (code === 'INTERNAL_SERVER_ERROR') {
        alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
      } else if (code === 'USER_INPUT_ERROR') {
        alertGO({message});
      } else if (code === 'BAD_USER_INPUT') {
        alertGO({message});
      } else if (code === 'AUTHENTICATION_ERROR') {
        // Do Nothing. Error handling should be done on the scren
      } else {
        console.log('ELSE ERROR:', error);
        alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
      }
    });
  }
};
