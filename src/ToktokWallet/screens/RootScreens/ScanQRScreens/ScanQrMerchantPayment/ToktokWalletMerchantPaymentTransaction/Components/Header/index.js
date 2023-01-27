import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {banner} from 'toktokwallet/assets';

export const Header = ({route}) => {
  const {merchant, branch, terminal, qrCode} = route.params;

  return (
    <ImageBackground source={banner.banner_logo} resizeMode="cover">
      <View style={styles.headerContainer}>
        {merchant?.logo && <Image source={{uri: merchant.logo}} style={styles.logo} />}
        <View style={merchant?.logo ? styles.withLogo : styles.withoutLogo}>
          <Text>{branch.branchName}</Text>
          <Text
            style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: COLOR.ORANGE, marginTop: moderateScale(5)}}>
            {terminal.terminalName}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: moderateScale(15),
    marginBottom: moderateScale(15),
  },
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
});
