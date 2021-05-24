import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {FONT, COLOR} from '../../res/variables'

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
    // marginRight: 66,
  },
  outer: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
  inner: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
});
