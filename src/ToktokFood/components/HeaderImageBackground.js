import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

const HeaderImageBackground = ({children}) => {
  return (
    <ImageBackground
      imageStyle={styles.imageStyle}
      style={styles.walletbackgroundimage}
      source={require('../assets/images/header-bg.png')}>
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
    // flex: 1,
    resizeMode: 'cover',
  },
});
