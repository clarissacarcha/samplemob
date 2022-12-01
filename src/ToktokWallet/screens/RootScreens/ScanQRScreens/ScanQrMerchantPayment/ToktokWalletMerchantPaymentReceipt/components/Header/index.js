import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const Header = ({route}) => {
  const {merchant, terminal, branch} = route.params;

  return (
    <View style={{alignItems: 'center'}}>
      {merchant.logo && <Image source={{uri: merchant.logo}} style={styles.logo} />}
      <View style={merchant.logo ? styles.withLogo : styles.withoutLogo}>
        <Text style={styles.headerText}>{branch.branchName}</Text>
        <Text style={styles.terminal}>{terminal.terminalName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: moderateScale(60),
    height: moderateScale(60),
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(100),
    resizeMode: 'contain',
  },
  withLogo: {
    marginTop: moderateScale(5),
    alignItems: 'center',
  },
  withoutLogo: {
    marginVertical: moderateScale(10),
    alignItems: 'center',
  },
  headerText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  toktokText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  loadText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  terminal: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
    marginTop: moderateScale(5),
  },
});
