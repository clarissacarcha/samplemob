import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DARK, LIGHT, MEDIUM} from '../../../../res/constants';
import {FONT, FONT_SIZE, COLOR} from '../../../../res/variables';
import {Shadow} from '../../../../revamp';

import HeaderImage from '../../../../assets/toktok/images/HeaderBackground.png';

const SearchInput = () => {
  return (
    <Shadow style={{...styles.inputBox, borderRadius: 5}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput placeholder="Search in toktok" placeholderTextColor={LIGHT} style={{flex: 1}} />
        <FeatherIcon name="search" size={25} color={MEDIUM} />
      </View>
    </Shadow>
  );
};

const Header = ({session}) => {
  return (
    <View style={{height: 160, backgroundColor: 'white', marginTop: -StatusBar.currentHeight}}>
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

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(Header);

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginHorizontal: 20,
    bottom: -10,
  },
  greetingBox: {
    height: 50,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  greetingText: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
});
