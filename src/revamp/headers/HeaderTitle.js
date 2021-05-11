import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {DARK, FONTS, ORANGE} from '../../res/constants';

export const HeaderTitle = ({label}) => {
  return (
    <View style={styles.box}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
  },
  outer: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
    color: DARK,
  },
  inner: {
    color: DARK,
    fontSize: 16,
    fontFamily: 'Jost-Medium',
  },
});
