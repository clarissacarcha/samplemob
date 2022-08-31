import React from 'react';
import {View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';
import {ICON_SET, VectorIcon} from 'src/revamp';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const HeaderRight = ({rightIconOnPress }) => {
  return (
    <TouchableOpacity onPress={rightIconOnPress} style={{justifyContent:"center",alignItems:"flex-end"}}>
      <VectorIcon iconSet={ICON_SET.Entypo} name="dots-three-vertical" color="#F6841F" size={16} style={{marginRight: 16}}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingRight: moderateScale(16),
  },
});