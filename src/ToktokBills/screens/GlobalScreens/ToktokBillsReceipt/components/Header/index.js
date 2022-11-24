import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

//UTIL
import {moderateScale} from 'toktokbills/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {bills_logo} from 'toktokbills/assets/images';

export const Header = ({route}) => {
  const {receipt} = route.params;
  const {billerDetails} = receipt;
  const [imageError, setImageError] = useState(false);

  return (
    <View style={{alignItems: 'center'}}>
      {billerDetails?.logo && !imageError && (
        <Image
          source={{uri: billerDetails.logo}}
          style={styles.logo}
          onError={err => {
            setImageError(!!err);
          }}
        />
      )}
      <View style={styles.logoTextContainer}>
        <Text style={billerDetails?.logo && !imageError ? styles.headerText : styles.billerNologo}>
          {billerDetails.descriptions}
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
  billerNologo: {
    marginVertical: moderateScale(10),
    fontSize: FONT_SIZE.M,
  },
});
