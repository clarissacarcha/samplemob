import React from 'react';
import {ImageBackground, StyleSheet, Platform} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const DEFAULT_IMAGE_HEIGHT = Platform.OS === 'android' ? moderateScale(110 + getStatusbarHeight) : moderateScale(125);
const DEFAULT_CONTAINER_HEIGHT =
  Platform.OS === 'android' ? moderateScale(135 + getStatusbarHeight) : moderateScale(145);

const HeaderImageBackground = ({
  children,
  customSize = {container: DEFAULT_CONTAINER_HEIGHT, bgImage: DEFAULT_IMAGE_HEIGHT},
}) => {
  return (
    <ImageBackground
      source={headerBg}
      imageStyle={[styles.image, {height: customSize.bgImage}]}
      style={[styles.container, {height: customSize.container}]}>
      {children}
    </ImageBackground>
  );
};

export default HeaderImageBackground;

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  container: {
    zIndex: 1,
  },
});
