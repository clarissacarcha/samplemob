import React from 'react';
import {View, StyleSheet, StatusBar, ImageBackground, Text} from 'react-native';

import {FONT, FONT_SIZE, SIZE} from '../../../../../../../res/variables';

import HeaderImage from '../../../../../../../assets/toktok/images/ProfileBackground.png';

export const Header = ({children}) => {
  return (
    <View>
      <View style={styles.headerBox}>
        <View style={styles.greetingBox}>
          <Text style={{fontFamily: FONT.REGULAR, paddingVertical: 10, fontSize: FONT_SIZE.XL + 4}}>Menu</Text>
        </View>
      </View>
      <View></View>
      <ImageBackground style={{height: 160}} source={HeaderImage} resizeMode="cover">
        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderBottomWidth: 3,
    borderColor: '#F8F8F8',
    elevation: 4,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginHorizontal: SIZE.MARGIN,
  },
  greetingBox: {
    paddingTop: StatusBar.currentHeight,
    height: Platform.select({android: 57 + StatusBar.currentHeight, ios: 50}),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: SIZE.MARGIN,
  },
  greetingText: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
});
