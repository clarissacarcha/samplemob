import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {home} from 'toktokwallet/assets';
import {moderateScale} from 'toktokwallet/helper';

export const HeaderHomeBackground = ({children}) => {
  return (
    <ImageBackground resizeMode="cover" style={styles.walletbackgroundimage} source={home.home_logo}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  walletbackgroundimage: {
    height: moderateScale(140),
    flex: 1,
  },
});
