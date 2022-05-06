import {ApolloLink, split, fromPromise} from 'apollo-link';
import {HOST_PORT, PROTOCOL, TOKTOK_WALLET_PROTOCOL, TOKTOK_WALLET_PROTOCOL_HOST_PORT, TOKTOK_MALL_PROTOCOL, TOKTOK_MALL_PROTOCOL_HOST_PORT} from '../../res/constants';
import {onError} from 'apollo-link-error';
import {ApolloClient} from 'apollo-client';
import AsyncStorage from '@react-native-community/async-storage';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {WebSocketLink} from 'apollo-link-ws';
import {createUploadLink} from 'apollo-upload-client';
import {getMainDefinition} from 'apollo-utilities';
import {setContext} from 'apollo-link-context';

import ENVIRONMENTS from 'src/common/res/environments';

const baseUrl = `${ENVIRONMENTS.TOKTOK_SERVER}/`;
const wsUrl = `ws://${HOST_PORT}/graphql`;

// const toktokWalletBaseUrl = `${TOKTOK_WALLET_PROTOCOL}://${TOKTOK_WALLET_PROTOCOL_HOST_PORT}/`;
const toktokWalletBaseUrl = `${ENVIRONMENTS.TOKTOKWALLET_SERVER}/`;
const toktokBillsLoadBaseUrl = `${ENVIRONMENTS.TOKTOKBILLSLOAD_SERVER}/`;
const toktokMallBaseUrl = `${ENVIRONMENTS.TOKTOKMALL_SERVER}/`;
const toktokFoodBaseUrl = `${ENVIRONMENTS.TOKTOKFOOD_SERVER}/`;
const toktokGoBaseUrl = `${ENVIRONMENTS.TOKTOKGO_SERVER}/`;

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
//   }
// });

const errorLinkLogger = onError(err => {
  console.log({ERROR_LINK: JSON.stringify(err, 0, 4)});
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

const setToktokFoodGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    const accountToken = await AsyncStorage.getItem('toktokFoodAccountToken');
    return {
      headers: {
        ...headers,
        authorization: accountToken ? `Bearer ${accountToken}` : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const setToktokWalletGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    // const accountToken = await AsyncStorage.getItem('toktokWalletAccountToken');
    const accountToken = await AsyncStorage.getItem('accessToken');
    const verifiedToken = await AsyncStorage.getItem('toktokWalletAuthenticationToken');
    return {
      headers: {
        ...headers,
        authorization: accountToken ? `Bearer ${accountToken}` : '',
        verifiedlogintoken: verifiedToken ? verifiedToken : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const setToktokWalletEnterpriseGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    const enterpriseToken = await AsyncStorage.getItem('toktokWalletEnterpriseToken');
    return {
      headers: {
        ...headers,
        authorization: enterpriseToken ? `Bearer ${enterpriseToken}` : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const setToktokBillsLoadGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    const accountToken = await AsyncStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        authorization: accountToken ? `Bearer ${accountToken}` : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const setToktokMallGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    const accountToken = await AsyncStorage.getItem('toktokMallAccountToken');
    return {
      headers: {
        ...headers,
        authorization: accountToken ? `Bearer ${accountToken}` : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const setToktokGoGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    const accountToken = await AsyncStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        'X-API-KEY': ENVIRONMENTS.TOKTOKGO_X_API_KEY,
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const setToktokMallAuthGraphqlTokenLink = setContext(async (_, {headers}) => {
  try {
    const accountToken = await AsyncStorage.getItem('toktokMallAuthAccountToken');
    return {
      headers: {
        ...headers,
        authorization: accountToken ? `Bearer ${accountToken}` : '',
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
    connectionParams: async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      return {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      };
    },
  },
});

// Terminating Link
const uploadLink = createUploadLink({
  uri: `${baseUrl}graphql/`,
});

const authUploadLink = createUploadLink({
  uri: `${baseUrl}auth/graphql/`,
});

const toktokFoodGraphqlUploadLink = createUploadLink({
  uri: `${toktokFoodBaseUrl}graphql/`,
});

const toktokWalletGraphqlUploadLink = createUploadLink({
  uri: `${toktokWalletBaseUrl}graphql/`,
});

const toktokWalletEnterpriseGraphqlUploadLink = createUploadLink({
  uri: `${toktokWalletBaseUrl}enterprise/graphql/`,
});

const toktokBillsLoadGraphqlUploadLink = createUploadLink({
  uri: `${toktokBillsLoadBaseUrl}graphql/`,
});

const toktokQuotationUploadLink = createUploadLink({
  uri: `${baseUrl}quotation/graphql/`,
});

const toktokGoUploadLink = createUploadLink({
  uri: `${toktokGoBaseUrl}graphql/`,
});
const toktokMallGraphqlUploadLink = createUploadLink({
  uri: `${toktokMallBaseUrl}graphql/`,
});

const toktokMallAuthGraphqlUploadLink = createUploadLink({
  uri: `${toktokMallBaseUrl}auth/graphql/`,
});

const splitLink = split(({query}) => {
  const definition = getMainDefinition(query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}, wsLink);

// const link = ApolloLink.from([errorLink, setTokenLink, splitLink, uploadLink]);
const link = ApolloLink.from([errorLinkLogger, setTokenLink, splitLink, uploadLink]);
const authClientlink = ApolloLink.from([errorLinkLogger, setTokenLink, authUploadLink]);
const toktokWalletGraphqlLink = ApolloLink.from([
  errorLinkLogger,
  setToktokWalletGraphqlTokenLink,
  toktokWalletGraphqlUploadLink,
]);
const toktokWalletEnterpriseGraphqlLink = ApolloLink.from([
  setToktokWalletEnterpriseGraphqlTokenLink,
  toktokWalletEnterpriseGraphqlUploadLink,
]);
const toktokBillsLoadGraphqlLink = ApolloLink.from([
  errorLinkLogger,
  setToktokBillsLoadGraphqlTokenLink,
  toktokBillsLoadGraphqlUploadLink,
]);
const toktokMallGraphqlLink = ApolloLink.from([
  errorLinkLogger,
  setTokenLink,
  // setToktokMallGraphqlTokenLink,
  toktokMallGraphqlUploadLink,
]);
const toktokMallAuthGraphqlLink = ApolloLink.from([
  errorLinkLogger,
  setTokenLink,
  // setToktokMallAuthGraphqlTokenLink,
  toktokMallAuthGraphqlUploadLink,
]);

const toktokFoodGraphqlLink = ApolloLink.from([
  errorLinkLogger,
  setTokenLink,
  // setToktokFoodGraphqlTokenLink,
  toktokFoodGraphqlUploadLink,
]);

const toktokGoGraphqlLink = ApolloLink.from([errorLinkLogger, setToktokGoGraphqlTokenLink, toktokGoUploadLink]);

const toktokQuotationGraphqlLink = ApolloLink.from([errorLinkLogger, setTokenLink, toktokQuotationUploadLink]);

export const CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export const AUTH_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: authClientlink,
});

export const TOKTOK_WALLET_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokWalletGraphqlLink,
});

export const TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokWalletEnterpriseGraphqlLink,
});

export const TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokMallGraphqlLink,
});
export const TOKTOK_MALL_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokMallGraphqlLink,
});

export const TOKTOK_MALL_AUTH_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokMallAuthGraphqlLink,
});
export const TOKTOK_FOOD_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getShops: {
            merge(existing = [], incoming) {
              console.log(existing, incoming);
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  link: toktokFoodGraphqlLink,
});

export const TOKTOK_QUOTATION_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokQuotationGraphqlLink,
});

export const TOKTOK_GO_GRAPHQL_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: toktokGoGraphqlLink,
});
