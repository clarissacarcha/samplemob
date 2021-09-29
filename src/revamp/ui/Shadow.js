import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Shadow = ({children, style}) => {
  return <View style={[styles.shadow, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
