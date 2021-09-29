import React from 'react';
import {ImageBackground, StyleSheet, Platform} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const HeaderImageBackground = ({children}) => {
  return (
    <ImageBackground imageStyle={styles.imageStyle} style={styles.walletBackGroundImage} source={headerBg}>
      {children}
    </ImageBackground>
  );
};

export default HeaderImageBackground;

const styles = StyleSheet.create({
  imageStyle: {
    resizeMode: 'cover',
    height: Platform.OS === 'android' ? moderateScale(103 + getStatusbarHeight) : moderateScale(105),
  },
  walletBackGroundImage: {
    zIndex: 1,
    height: Platform.OS === 'android' ? moderateScale(133 + getStatusbarHeight) : moderateScale(125),
  },
});
