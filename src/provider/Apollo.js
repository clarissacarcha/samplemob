import React from 'react';
import {ApolloProvider as Provider} from '@apollo/react-hooks';
import {CLIENT} from '../graphql';

export const ApolloProvider = ({children}) => <Provider client={CLIENT}>{children}</Provider>;
