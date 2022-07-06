import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

//UTIL
import {moderateScale} from 'toktokbills/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {bills_logo} from 'toktokbills/assets/images';
import tokwa2 from 'toktokwallet/assets/images/tokwa2.png';

export const Header = ({route}) => {
  //   const {receipt} = route.params;
  //   const {billerDetails} = receipt;
  return (
    <View style={{alignItems: 'center'}}>
      {/* {billerDetails?.logo && <Image source={{uri: billerDetails.logo}} style={styles.logo} />} */}
      <Image source={tokwa2} style={styles.logo} />
      <View style={styles.logoTextContainer}>
        <Text>
          <Text style={styles.headerText}>LBC Express</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: moderateScale(60),
    height: moderateScale(60),
    marginBottom: moderateScale(10),
  },
  logoTextContainer: {
    flexDirection: 'row',
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
