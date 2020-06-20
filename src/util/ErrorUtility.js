// import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';

export const onError = ({graphQLErrors, networkError}) => {
  if (networkError) {
    Alert.alert('', 'Network error occurred. Please check your internet connection.');
  } else if (graphQLErrors.length > 0) {
    Alert.alert('', graphQLErrors[0].message);
  }
};
