// import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ApolloError} from 'apollo-client';

export const onError = (error) => {
  console.log(JSON.stringify(error), 'asdasd');
  const {graphQLErrors, networkError} = error;

  if (networkError) {
    Alert.alert('', 'Network error occurred. Please check your internet connection.');
  } else if (graphQLErrors.length > 0) {
    graphQLErrors.map(({message, locations, path, code}) => {
      if (code === 'INTERNAL_SERVER_ERROR') {
        Alert.alert('', 'Something went wrong.');
      } else if (code === 'USER_INPUT_ERROR') {
        Alert.alert('', message);
      } else if (code === 'BAD_USER_INPUT') {
        Alert.alert('', message);
      } else if (code === 'AUTHENTICATION_ERROR') {
        // Do Nothing. Error handling should be done on the scren
      } else {
        console.log('ELSE ERROR:', error);
        Alert.alert('', 'Something went wrong...');
      }
    });
  }
};

export const onErrorAlert = ({alert, error}) => {
  try {

    const {graphQLErrors, networkError} = error;

    if (networkError) {
      alert({message: 'Network error occurred. Please check your internet connection.'});
    } else if (graphQLErrors.length > 0) {
      graphQLErrors.map(({message, locations, path, code}) => {
        if (code === 'INTERNAL_SERVER_ERROR') {
          alert({message: 'Something went wrong.'});
        } else if (code === 'USER_INPUT_ERROR') {
          alert({message});
        } else if (code === 'BAD_USER_INPUT') {
          alert({message});
        } else if (code === 'AUTHENTICATION_ERROR') {
          // Do Nothing. Error handling should be done on the scren
        } else {
          alert({message: 'Something went wrong...'});
        }
      });
    }
  } catch (err) {
    console.log('ON ERROR ALERT: ', err);
  }
};
