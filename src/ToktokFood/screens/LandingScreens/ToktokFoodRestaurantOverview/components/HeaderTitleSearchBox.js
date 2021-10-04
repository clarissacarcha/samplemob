import React, { useState, useContext } from 'react';
import {View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {searchIcon} from 'toktokfood/assets/images';

import { VerifyContext } from '../components';

// Utils
import {moderateScale, verticalScale, getStatusbarHeight} from 'toktokfood/helper/scale';

// State must be global to share with other components
export const HeaderTitleSearchBox = ({}) => {
  const navigation = useNavigation();
  const { searchProduct, setSearchProduct } = useContext(VerifyContext)

  return (
    <View style={styles.searchBoxContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
        <FIcon5 name="chevron-left" size={15} />
      </TouchableOpacity>
      <View style={[styles.textInputWrapper, styles.searchBox]}>
        <Image style={styles.searchBoxIcon} source={searchIcon} />
        <TextInput
          value={searchProduct}
          onChangeText={(value) => setSearchProduct(value) }
          placeholder="What would you like to eat?"
          style={[styles.textInputFontStyles]}
        />
      </View>
    </View>
  );
};

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
    // marginTop: Platform.OS === 'android' ? verticalScale(37) : verticalScale(25),
    paddingRight: moderateScale(20),
    marginTop: Platform.OS === 'android' ? getStatusbarHeight + 15 : verticalScale(20),
  },
  searchBox: {
    flex: 1,
    borderRadius: 13,
    backgroundColor: '#F9F9F9',
  },
  textInputFontStyles: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  textInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? moderateScale(48) : verticalScale(40),
    // paddingVertical: 10,
  },
  searchBoxIcon: {
    marginHorizontal: 10,
    width: 20,
    height: 20,
  },
});
