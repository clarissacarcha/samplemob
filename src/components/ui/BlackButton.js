import React from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {COLOR, DARK, FONT_REGULAR} from '../../res/constants';

export const BlackButton = ({label, onPress, containerStyle = {}}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={COLOR}
      style={{margin: 20, borderRadius: 10, ...containerStyle}}>
      <View style={styles.button}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: COLOR,
    fontSize: 14,
    fontFamily: FONT_REGULAR
  },
});
