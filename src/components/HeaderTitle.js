import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {DARK, FONTS, ORANGE} from '../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../res/variables';

export const HeaderTitle = ({label}) => {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>
        {label[0]}
        <Text style={styles.title}> {label[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    width: "100%"
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.BOLD,
  },
});
