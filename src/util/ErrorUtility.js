// import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';

export const onError = error => {
  console.log(error);
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
      } else {
        Alert.alert('', 'Something went wrong...');
      }
    });
  }
};
