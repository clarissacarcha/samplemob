// import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ApolloError} from 'apollo-client';
import {navigate, replace} from 'src/app/Nav/RootNavigation';
import {useAlertGO} from '../hooks';
const alertGO = useAlertGO();

export const onErrorAppSync = error => {
  const {graphQLErrors, networkError} = error;
  console.log(graphQLErrors);
  if (networkError) {
    Alert.alert('', 'Network error occurred. Please check your internet connection.');
  } else if (graphQLErrors.length > 0) {
    graphQLErrors.map(({message, locations, path, errorType}) => {
      if (errorType === 'INTERNAL_SERVER_ERROR') {
        alertGO({message});
      } else if (errorType === 'BAD_USER_INPUT') {
        alertGO({message});
      } else if (errorType === 'AUTHENTICATION_ERROR') {
        // Do Nothing. Error handling should be done on the scren
      } else if (errorType === 'ExecutionTimeout') {
        alertGO({message});
      } else {
        console.log('ELSE ERROR:', error);
        // Alert.alert('', 'Something went wrong...');
        alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
      }
    });
  }
};
