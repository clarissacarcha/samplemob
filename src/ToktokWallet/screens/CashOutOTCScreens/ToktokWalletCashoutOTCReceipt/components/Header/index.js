import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const Header = ({route}) => {
  const {logo, description} = route.params.transactionDetails.otcPartnerDetails;

  return (
    <View style={{alignItems: 'center'}}>
      {logo && <Image source={{uri: logo}} style={styles.logo} />}
      <View style={logo ? styles.withLogo : styles.withoutLogo}>
        <Text style={styles.headerText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: moderateScale(60),
    height: moderateScale(60),
    marginBottom: moderateScale(10),
    resizeMode: 'contain',
  },
  withLogo: {
    marginTop: moderateScale(5),
  },
  withoutLogo: {
    marginVertical: moderateScale(10),
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
