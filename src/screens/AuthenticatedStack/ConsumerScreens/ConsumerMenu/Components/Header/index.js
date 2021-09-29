import React from 'react';
import {View, Text, StyleSheet, TextInput, StatusBar, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Shadow} from '../../../../../../revamp';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../res/variables';

import HeaderImage from '../../../../../../assets/toktok/images/HeaderBackground.png';

export const Header = ({children}) => {
  return (
    <View style={{height: 130, backgroundColor: 'white'}}>
      <ImageBackground style={{height: 130}} source={HeaderImage} resizeMode="cover">
        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
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
    height: 50,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    paddingHorizontal: SIZE.MARGIN,
  },
  greetingText: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
});
