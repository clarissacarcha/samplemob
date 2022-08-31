import React, {createRef, useContex, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {CheckIdleStateContext, DateModal} from 'toktokwallet/components';
import {moderateScale} from 'toktokwallet/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {calendar_icon} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
import moment from 'moment';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

export const CustomDateInput = ({
  style,
  placeholder,
  errorMessage = '',
  onSelectedValue = () => {},
  selectedValue = '',
}) => {
  const [visible, setVisible] = useState(false);

  const onDateChange = date => {
    onSelectedValue(date);
  };

  return (
    <>
      <DateModal visible={visible} setVisible={setVisible} onDateChange={onDateChange} value={selectedValue} />
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          ...styles.input,
          ...styles.selectionContainer,
          ...(errorMessage != '' ? styles.errorBorder : {}),
          ...style,
        }}>
        {selectedValue == '' ? (
          <Text style={[styles.selectionText, {color: COLOR.DARK}]}>mm/dd/yy</Text>
        ) : (
          <Text style={styles.selectionText}>{moment(selectedValue).format('MM/DD/YYYY')}</Text>
        )}
        <Image source={calendar_icon} style={{width: moderateScale(20), height: moderateScale(20)}} />
      </TouchableOpacity>
      {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    paddingHorizontal: moderateScale(15),
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
  errorMessage: {
    color: COLOR.RED,
    fontSize: FONT_SIZE.S,
    marginTop: 5,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
  },
  selectionText: {
    flex: 1,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
});
