import React from 'react';
import {View, Text, StyleSheet, TextInput, StatusBar, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Shadow} from '../../../../../../revamp';
import {ThrottledHighlight} from '../../../../../../components_section/';

import {useNavigation} from '@react-navigation/core';

import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../res/variables';

import HeaderImage from '../../../../../../assets/toktok/images/HeaderBackground.png';

const SearchInput = () => {
  const navigation = useNavigation();

  return (
    <ThrottledHighlight
      underlayColor={COLOR.WHITE_UNDERLAY}
      onPress={() => {
        navigation.push('ToktokSearch');
      }}
      style={{bottom: -10, marginHorizontal: SIZE.MARGIN, borderRadius: 5, borderWidth: 1, borderColor: COLOR.LIGHT}}>
      <View style={{...styles.inputBox, borderRadius: 5}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text style={{color: COLOR.MEDIUM}}>Search in toktok</Text>
          </View>
          <FeatherIcon name="search" size={25} color={COLOR.DARK} />
        </View>
      </View>
    </ThrottledHighlight>
  );
};

export const Header = () => {
  const session = useSelector((state) => state.session);

  return (
    <View style={{height: 160, backgroundColor: 'white'}}>
      <ImageBackground style={{height: 130}} source={HeaderImage} resizeMode="cover">
        <View style={styles.greetingBox}>
          <Text style={styles.greetingText}>
            Hello, {session.user.person.firstName} {session.user.person.lastName}
          </Text>
        </View>
        <SearchInput />
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
