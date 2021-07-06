import React from 'react';
import {ImageBackground, StyleSheet, Platform} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight, scale} from 'toktokfood/helper/scale';

const HeaderImageBackground = ({children}) => {
  return (
    <ImageBackground imageStyle={styles.detailsImage} style={styles.detailsContainer} source={headerBg}>
      {children}
    </ImageBackground>
  );
};

export default HeaderImageBackground;

const styles = StyleSheet.create({
  detailsImage: {
    resizeMode: 'cover',
    height: Platform.OS === 'android' ? moderateScale(150 + getStatusbarHeight) : moderateScale(170),
  },
  detailsContainer: {
    zIndex: 1,
    height: Platform.OS === 'android' ? moderateScale(235 + getStatusbarHeight) : scale(250),
  },
});
