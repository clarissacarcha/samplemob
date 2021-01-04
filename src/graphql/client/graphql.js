import {ApolloLink, split, fromPromise} from 'apollo-link';
import {HOST_PORT, PROTOCOL} from '../../res/constants';
import {onError} from 'apollo-link-error';
import {ApolloClient} from 'apollo-client';
import AsyncStorage from '@react-native-community/async-storage';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {WebSocketLink} from 'apollo-link-ws';
import {createUploadLink} from 'apollo-upload-client';
import {getMainDefinition} from 'apollo-utilities';
import {setContext} from 'apollo-link-context';

import axios from 'axios';

const baseUrl = `${PROTOCOL}://${HOST_PORT}/`;
const wsUrl = `ws://${HOST_PORT}/graphql`;

// const errorLink = onError(({graphQLErrors, networkError}) => {
//   if (graphQLErrors) {
//     graphQLErrors.map(({message, locations, path, code}) => {
//       if (code === 'INTERNAL_SERVER_ERROR') {
//         Alert.alert('', 'Something went wrong.');
//       } else {
//         Alert.alert('', message);
//       }
//     });
//   }
//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//   }
// });

// const refetch = async () => {
//   const res = await axios.get('https://toktok.ph');
//   console.log(res);
// };

// const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
//   if (graphQLErrors) {
//     if (graphQLErrors[0].code === 'BAD_USER_INPUT') {
//       refetch();
//     }
//   }
//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//     // if you would also like to retry automatically on
//     // network errors, we recommend that you use
//     // apollo-link-retry
//   }
// });

const errorLinkLogger = onError((err) => {
  console.log('ERROR LINK LOG');
  console.log(err);
});

const setTokenLink = setContext(async (_, {headers}) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    reconnect: true,
  },
});

const splitLink = split(({query}) => {
  const definition = getMainDefinition(query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}, wsLink);

// Terminating Link
const uploadLink = createUploadLink({
  uri: `${baseUrl}graphql/`,
});

const authUploadLink = createUploadLink({
  uri: `${baseUrl}auth/graphql/`,
});

// const link = ApolloLink.from([errorLink, setTokenLink, splitLink, uploadLink]);
const link = ApolloLink.from([errorLinkLogger, setTokenLink, uploadLink]);
const authClientlink = ApolloLink.from([setTokenLink, authUploadLink]);

export const CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export const AUTH_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: authClientlink,
});
