import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, COLOR_UNDERLAY, FONT_REGULAR} from '../../res/constants';

export const BlackButton = ({label, onPress, style}) => {
  return (
    <TouchableHighlight onPress={onPress} style={styles.blackButton} underlayColor={COLOR}>
      <View style={[styles.blackButtonBox, style]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    borderRadius: 5,
  },
  blackButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    backgroundColor: DARK,
    borderRadius: 5,
  },
  label: {
    color: COLOR,
    fontSize: 14 ,
    paddingHorizontal: 10,
    fontFamily: FONT_REGULAR
  },
});
