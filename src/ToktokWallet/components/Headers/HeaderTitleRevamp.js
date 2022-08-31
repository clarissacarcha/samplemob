import React from 'react';
import {View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity} from 'react-native';
import {moderateScale, scale} from 'toktokbills/helper';
import {logos} from 'toktokwallet/assets';
import {ICON_SET, VectorIcon} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const HeaderTitleRevamp = ({
  isLogo,
  label,
  labelColor = 'black',
  headerBackLabel = '',
  headerStyle = {},
  labelStyle = {},
  imageSrc = logos.toktokwallet_logo,
}) => {
  return (
    <View style={[styles.header, headerStyle]}>
      {isLogo ? (
        <Image resizeMode="contain" style={styles.logo} source={imageSrc} />
      ) : (
        <Text style={[styles.title, {color: labelColor}, labelStyle]}>{label}</Text>
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
    fontSize: moderateScale(FONT_SIZE.XL),
    fontFamily: FONT.REGULAR,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
