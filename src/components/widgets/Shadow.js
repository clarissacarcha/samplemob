import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Shadow = ({children}) => <View style={styles.shadow}>{children}</View>;

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: 'white',
    borderRadius: 10,
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
