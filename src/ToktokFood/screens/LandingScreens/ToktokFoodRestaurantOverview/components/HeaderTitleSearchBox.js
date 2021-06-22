import React from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Image, Platform} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {paperRoll, searchIcon} from 'toktokfood/assets/images';

// Utils
import {verticalScale} from 'toktokfood/helper/scale';

// State must be global to share with other components
const HeaderTitleSearchBox = () => {
  return (
    <View style={styles.searchBoxContainer}>
      <TouchableOpacity style={styles.headerBack}>
        <FIcon5 name="chevron-left" size={15} />
      </TouchableOpacity>
      <View style={[styles.textInputWrapper, styles.searchBox]}>
        <Image style={styles.searchBoxIcon} source={searchIcon} />
        <TextInput placeholder="What would you like to eat?" multiline={false} style={[styles.textInputFontStyles]} />
      </View>
      <TouchableOpacity style={styles.headerBack}>
        <Image style={styles.paperRollIcon} source={paperRoll} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderTitleSearchBox;

const styles = StyleSheet.create({
  headerBack: {
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  paperRollIcon: {
    width: 18,
    height: 18,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? 53 : 35,
  },
  searchBox: {
    borderRadius: 13,
    backgroundColor: '#F9F9F9',
    flex: 1,
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
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(40),
    // paddingVertical: 10,
  },
  searchBoxIcon: {
    marginHorizontal: 10,
    width: 20,
    height: 20,
  },
});
