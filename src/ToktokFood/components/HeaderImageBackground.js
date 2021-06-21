import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';

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
    height: 150,
    resizeMode: 'cover',
  },
  walletBackGroundImage: {
    height: 178,
  },
});
