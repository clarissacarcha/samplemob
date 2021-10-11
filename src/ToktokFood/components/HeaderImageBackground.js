import React from 'react';
import {ImageBackground, StyleSheet, Platform} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const WITHOUT_SEARCH_IMAGE_HEIGHT = Platform.OS === 'android' ? moderateScale(70 + getStatusbarHeight) : moderateScale(70);
const WITHOUT_SEARCH_CONTAINER_HEIGHT = Platform.OS === 'android' ? moderateScale(70 + getStatusbarHeight) : moderateScale(70);

const WITH_SEARCH_CONTAINER_HEIGHT = Platform.OS === 'android' ? moderateScale(105 + getStatusbarHeight) : moderateScale(105);
const WITH_SEARCH_IMAGE_HEIGHT = Platform.OS === 'android' ? moderateScale(80 + getStatusbarHeight) : moderateScale(80)

const HeaderImageBackground = ({
  children,
  // customSize = {container: DEFAULT_CONTAINER_HEIGHT, bgImage: DEFAULT_IMAGE_HEIGHT},
  styleContainer,
  searchBox = true
}) => {
  return (
    <ImageBackground
      source={headerBg}
      imageStyle={[
        styles.image,
        { height: searchBox ? WITH_SEARCH_IMAGE_HEIGHT : WITHOUT_SEARCH_IMAGE_HEIGHT},
      ]}
      style={[
        styles.container,
        {
          height: searchBox ? WITH_SEARCH_CONTAINER_HEIGHT : WITHOUT_SEARCH_CONTAINER_HEIGHT,
          justifyContent: !searchBox ? 'center' : 'flex-start'
        }, 
        styleContainer
      ]}
    >
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
