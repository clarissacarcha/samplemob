import React from 'react';
import {View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {HeaderBack} from './HeaderBack';
import {moderateScale, scale} from 'toktokwallet/helper';
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
        <Image
          resizeMode="contain"
          style={{height: moderateScale(30), width: moderateScale(150)}}
          source={require('toktokload/assets/images/toktokload-header.png')}
        />
      ) : (
        <Text
          style={{
            fontSize: moderateScale(FONT_SIZE.L),
            fontFamily: FONT.REGULAR,
            color: labelColor,
            fontWeight: '400',
          }}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
