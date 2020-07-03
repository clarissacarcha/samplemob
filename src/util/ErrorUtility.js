// import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';

export const onError = ({graphQLErrors, networkError}) => {
  if (networkError) {
    Alert.alert('', 'Network error occurred. Please check your internet connection.');
  } else if (graphQLErrors.length > 0) {
    graphQLErrors.map(({message, locations, path, code}) => {
      if (code === 'INTERNAL_SERVER_ERROR') {
        Alert.alert('', 'Something went wrong.');
      } else {
        Alert.alert('', message);
      }
    });
  }
};
