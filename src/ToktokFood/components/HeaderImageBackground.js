import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

// assets
import {headerBg} from 'toktokfood/assets/images';

const HeaderImageBackground = ({children}) => {
  return (
    <ImageBackground imageStyle={styles.imageStyle} style={styles.walletbackgroundimage} source={headerBg}>
      {children}
    </ImageBackground>
  );
};

export default HeaderImageBackground;

const styles = StyleSheet.create({
  imageStyle: {
    resizeMode: 'cover',
  },
  walletbackgroundimage: {
    backgroundColor: 'transparent',
  },
});
