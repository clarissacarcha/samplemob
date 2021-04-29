import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR, DARK, DIRTY_WHITE, LIGHT, MEDIUM, FONT_REGULAR, COLORS} from '../../../../res/constants';

const SearchInput = () => {
  return (
    <View style={styles.inputBox}>
      <TextInput
        placeholder="Search in toktok"
        placeholderTextColor={LIGHT}
        style={{flex: 1, fontFamily: FONT_REGULAR}}
      />
      <FeatherIcon name="search" size={25} color={MEDIUM} />
    </View>
  );
};

const Header = () => {
  return (
    <View style={styles.headerBox}>
      <SearchInput />
      {/* <NotificationButton /> */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerBox: {
    height: 60 + StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR,
    paddingHorizontal: 20,
    marginTop: -StatusBar.currentHeight,
  },

  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    // backgroundColor: COLORS.TRANSPARENT_GRAY,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginTop: StatusBar.currentHeight,
  },
});
