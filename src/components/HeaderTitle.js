import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
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
    marginRight: 66,
    width: Platform.select({ios: '100%', android: null}),
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.BOLD,
  },
});
