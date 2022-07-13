import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';

//HELPER
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import {info_icon} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const PolicyNote = ({onPress, disabled = true, note1, note2, containerStyle}) => {
  // 'All transactions made before 01.00 PM will be processed within the day.'
  // 'All transactions after 01.00 PM will be processed the next banking day.'
  return (
    <TouchableOpacity style={[styles.note, containerStyle]} onPress={onPress} disabled={disabled}>
      <Image source={info_icon} style={styles.noteLogo} />
      <View>
        <Text style={styles.noteText}>{note1}</Text>
        {!!note2 && <Text style={styles.noteText}>{note2}</Text>}
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
    fontSize: FONT_SIZE.S,
    marginHorizontal: moderateScale(10),
  },
  noteLogo: {
    height: moderateScale(12),
    width: moderateScale(12),
    marginTop: Platform.OS == 'android' ? moderateScale(3) : 0,
  },
});
