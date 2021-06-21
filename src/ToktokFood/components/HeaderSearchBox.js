import React from 'react';
import {View, StyleSheet, TextInput, Image} from 'react-native';

import {FONT, FONT_SIZE, COLOR} from '../../res/variables';
import {searchIcon} from '../assets/images';

// State must be global to share with other components
const HeaderSearchBox = () => {
  return (
    <View style={styles.searchBoxContainer}>
      <View style={[styles.textInputWrapper, styles.searchBoxShadow]}>
        <Image style={styles.searchBoxIcon} source={searchIcon} />
        <TextInput
          placeholder="What would you like to eat?"
          multiline={false}
          style={[styles.searchBox, styles.textInputFontStyles]}
        />
      </View>
    </View>
  );
};

export default HeaderSearchBox;

const styles = StyleSheet.create({
  searchBoxContainer: {
    left: 0,
    bottom: 25,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
  searchBox: {
    height: 50,
    width: '100%',
    paddingEnd: 10,
    borderRadius: 13,
    paddingStart: 42,
    backgroundColor: '#FFF',
  },
  searchBoxShadow: {
    shadowColor: '#949494',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInputFontStyles: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  textInputWrapper: {
    height: 51,
    width: '93%',
    display: 'flex',
    borderRadius: 13,
    position: 'relative',
    flexDirection: 'row',
  },
  searchBoxIcon: {
    left: 13,
    width: 20,
    height: 20,
    zIndex: 99,
    alignSelf: 'center',
    position: 'absolute',
  },
});
