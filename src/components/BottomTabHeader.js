import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {DARK, ORANGE} from '../res/constants';

export const BottomTabHeader = ({label}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
    color: DARK,
  },
  inner: {
    color: ORANGE,
  },
  header: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 14,

    backgroundColor: 'white',
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
