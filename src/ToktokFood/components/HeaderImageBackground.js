import React from 'react';
import {ImageBackground, StyleSheet, Platform} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const HeaderImageBackground = ({children}) => {
  return (
    <ImageBackground imageStyle={styles.image} style={styles.container} source={headerBg}>
      {children}
    </ImageBackground>
  );
};

export default HeaderImageBackground;

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: Platform.OS === 'android' ? moderateScale(110 + getStatusbarHeight) : moderateScale(125),
  },
  container: {
    zIndex: 1,
    height: Platform.OS === 'android' ? moderateScale(135 + getStatusbarHeight) : moderateScale(145),
  },
});
