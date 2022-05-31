import React from 'react';
import {View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {HeaderBack} from './HeaderBack';
import {moderateScale, scale} from 'toktokbills/helper';
import {toktokbills} from 'toktokbills/assets';
import MIcon from 'react-native-vector-icons/MaterialIcons';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const HeaderTitle = ({
  isRightIcon,
  rightIcon = null,
  rightIconOnPress,
  isLogo,
  label,
  labelColor = 'black',
  backButtonColor = 'black',
  headerBackLabel = '',
  headerStyle = {},
}) => {
  return (
    <View style={[styles.header, headerStyle]}>
      {isLogo ? (
        <Image resizeMode="contain" style={styles.logo} source={toktokbills} />
      ) : (
        <Text style={[styles.title, {color: labelColor}]}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: moderateScale(23),
    width: moderateScale(130),
  },
  title: {
    fontSize: moderateScale(FONT_SIZE.L),
    fontFamily: FONT.REGULAR,
  },
});
