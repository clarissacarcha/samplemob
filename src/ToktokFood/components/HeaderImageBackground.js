import React from 'react';
import {ImageBackground, StyleSheet, Platform} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight, scale} from 'toktokfood/helper/scale';

const HeaderImageBackground = ({children, forDetailPage}) => {
  return (
    <ImageBackground
      imageStyle={forDetailPage ? styles.detailsImage : styles.image}
      style={forDetailPage ? styles.detailsContainer : styles.container}
      source={headerBg}>
      {children}
    </ImageBackground>
  );
};

export default HeaderImageBackground;

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: Platform.OS === 'android' ? moderateScale(103 + getStatusbarHeight) : moderateScale(115),
  },
  container: {
    zIndex: 1,
    height: Platform.OS === 'android' ? moderateScale(133 + getStatusbarHeight) : moderateScale(115),
  },
  detailsImage: {
    resizeMode: 'cover',
    height: Platform.OS === 'android' ? moderateScale(150 + getStatusbarHeight) : moderateScale(170),
  },
  detailsContainer: {
    zIndex: 1,
    height: Platform.OS === 'android' ? moderateScale(235 + getStatusbarHeight) : scale(250),
  },
});
