import {createAuthLink} from 'aws-appsync-auth-link';
import {createSubscriptionHandshakeLink} from 'aws-appsync-subscription-link';

import {ApolloLink} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';

import ENVIRONMENTS from '../../../common/res/environments';

const url = ENVIRONMENTS.TOKTOKGO_SERVER;
const region = ENVIRONMENTS.TOKTOKGO_REGION;
const auth = {
  type: 'API_KEY',
  apiKey: ENVIRONMENTS.TOKTOKGO_X_API_KEY,
};

const websocketClient = createClient({
  uri: url,
});

const httpLink = createHttpLink(websocketClient);

const link = ApolloLink.from([
  createAuthLink({url, region, auth}),
  createSubscriptionHandshakeLink({url, region, auth}, httpLink),
]);

export const TOKTOKGO_SUBSCRIPTION_CLIENT = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
