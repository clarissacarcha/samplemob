import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import {sortBy} from 'lodash';
import {Separator} from 'toktokload/components';
import {VectorIcon, ICON_SET} from 'src/revamp';
import {moderateScale} from 'toktokload/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE, MARGIN} = CONSTANTS;

export const SearchInput = ({
  onClear,
  search = '',
  onChangeText,
  placeholder,
  containerStyle,
  returnKeyType = 'done',
  hasClear,
}) => {
  return (
    <View style={[styles.searchField, containerStyle]}>
      <View style={[styles.inputContainer]}>
        <VectorIcon iconSet={ICON_SET.Fontisto} name="search" color={COLOR.ORANGE} size={moderateScale(15)} />
        <TextInput
          defaultValue={search}
          style={styles.input}
          placeholder={placeholder}
          onChangeText={onChangeText}
          returnKeyType={returnKeyType}
          placeholderTextColor="#9E9E9E"
        />
        {search !== '' && (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
            style={styles.closeBtn}>
            <VectorIcon iconSet={ICON_SET.Ionicon} color={COLOR.DARK} name="md-close" size={moderateScale(20)} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  searchField: {
    zIndex: 1,
    backgroundColor: 'white',
  },
  contactlist: {
    flex: 1,
    padding: MARGIN.M,
  },
  inputContainer: {
    paddingHorizontal: moderateScale(15),
    height: moderateScale(40),
    fontSize: FONT_SIZE.M,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    fontFamily: FONT.REGULAR,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    padding: 0,
    marginLeft: moderateScale(10),
    alignSelf: 'center',
    flex: 1,
  },
  icon: {
    height: moderateScale(20),
    width: moderateScale(20),
    alignSelf: 'center',
    tintColor: '#F6841F',
  },
  closeBtn: {
    paddingLeft: moderateScale(10),
  },
});
