import React, {useState, useContext} from 'react';
import {View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {searchIcon} from 'toktokfood/assets/images';

import {VerifyContext} from '../components';

// Utils
import {moderateScale, verticalScale, getStatusbarHeight} from 'toktokfood/helper/scale';

// State must be global to share with other components
export const HeaderTitleSearchBox = ({onCallBackSearch}) => {
  const navigation = useNavigation();
  const {searchProduct, setSearchProduct} = useContext(VerifyContext);
  // const [ searchProduct, setSearchProduct ] = useState('')

  return (
    <View style={styles.searchBoxContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack} hitSlop={styles.hitSlop}>
        <FIcon5 name="chevron-left" size={15} />
      </TouchableOpacity>
      <View style={[styles.textInputWrapper, styles.searchBox]}>
        <Image style={styles.searchBoxIcon} source={searchIcon} />
        <TextInput
          defaultValue={searchProduct}
          onChangeText={val => setSearchProduct(val)}
          placeholder="What would you like to eat?"
          style={styles.textInputFontStyles}
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
    // zIndex: 5,
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
    flex: 1,
    // width: '100%',
    paddingRight: 10,
  },
  textInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: Platform.OS == 'android' ? 0 : 10,
  },
  searchBoxIcon: {
    marginHorizontal: 10,
    width: 20,
    height: 20,
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  hitSlop: {
    top: moderateScale(40),
    bottom: moderateScale(40),
    left: moderateScale(40),
    right: moderateScale(40),
  },
});
