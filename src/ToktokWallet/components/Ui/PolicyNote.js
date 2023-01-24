import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text, Platform} from 'react-native';

//HELPER
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import {info_icon} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const PolicyNote = ({
  onPress,
  disabled = true,
  note1,
  note2,
  containerStyle,
  subTextNote1,
  onPressNote1,
  title,
  titleStyles,
  endOfNote1,
  subTextNote1Styles,
  noteText1Styles,
  noteText2Styles,
  noteTextStyles,
}) => {
  return (
    <TouchableOpacity style={[styles.note, containerStyle]} onPress={onPress} disabled={disabled}>
      <Image source={info_icon} style={styles.noteLogo} />
      <View>
        {!!title && <Text style={[styles.title, titleStyles]}>{title}</Text>}
        <Text style={[styles.noteText, noteText1Styles, noteTextStyles]}>
          {note1}
          <Text style={[styles.subTextNote1, subTextNote1Styles]} onPress={onPressNote1}>
            {subTextNote1}
          </Text>
          {endOfNote1}
        </Text>
        {!!note2 && <Text style={[styles.noteText, noteText2Styles, noteTextStyles]}>{note2}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    backgroundColor: COLOR.LIGHT_YELLOW,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  noteText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.M,
    marginHorizontal: moderateScale(10),
  },
  noteLogo: {
    height: moderateScale(12),
    width: moderateScale(12),
    marginTop: Platform.OS === 'android' ? moderateScale(4) : moderateScale(2),
  },
  subTextNote1: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
    textDecorationLine: 'underline',
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
    marginHorizontal: moderateScale(10),
    marginBottom: moderateScale(10),
  },
});
