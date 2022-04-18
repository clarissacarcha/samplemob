import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, StatusBar, Image} from 'react-native';
import {useSelector} from 'react-redux';
import ToktokIcon from '../../../../../../../assets/images/ToktokHeader.png';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Shadow} from '../../../../../../../revamp';
import {ThrottledHighlight} from '../../../../../../../components_section';
import TypeWriter from 'react-native-typewriter';
import {useNavigation} from '@react-navigation/core';

import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';

import HeaderImage from '../../../../../../../assets/toktok/images/HeaderBackground.png';

export const Header = () => {
  const session = useSelector(state => state.session);

  return (
    <View style={styles.headerBox}>
      <View style={styles.greetingBox}>
        <Image source={ToktokIcon} resizeMode={'contain'} style={{height: 25, width: 87}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  greetingBox: {
    backgroundColor: 'red',
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: SIZE.MARGIN,
  },
  greetingText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
});
