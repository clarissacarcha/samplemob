import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {DARK, ORANGE} from '../res/constants';

export const HeaderTitle = ({label}) => {
  return (
    <Text style={styles.outer}>
      {label[0]}
      <Text style={styles.inner}> {label[1]}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  outer: {
    fontSize: 16,
    fontFamily: 'Jost-Medium',
    color: DARK,
    marginLeft: -20,
  },
  inner: {
    color: ORANGE,
    fontSize: 16,
    fontFamily: 'Jost-Medium',
  },
});
