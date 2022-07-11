import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {ContextChannelForm} from '../../components';
import {CustomRadioButton} from 'toktokwallet/components';
import {YellowButton} from 'src/revamp';
const {FONT_FAMILY: FONT, FONT_SIZE, COLOR, SHADOW, SIZE} = CONSTANTS;

const DAY_LIST = [
  {label: 'Weekday', description: 'Monday - Friday', value: 0},
  {label: 'Weekend', description: 'Saturday - Sunday', value: 1},
];

const TIME_LIST = [
  {label: 'Morning', description: '8:00 AM - 12:00 PM', value: 0},
  {label: 'Afternoon', description: '1:00 PM - 5:00 PM', value: 1},
];

export const modifyPlaceholderAccordingToChannel = channelName => {
  switch (channelName) {
    case 'Skype':
      return 'Skype ID';
    case 'Messenger':
      return 'Messenger link';

    default:
      return `${channelName} number`;
  }
};

export const ChannelForm = ({data}) => {
  const {channelName, contactDescription} = data;
  const isMobileNumber = contactDescription == 'number';
  const placeholder = modifyPlaceholderAccordingToChannel(channelName);
  const {
    numberOrLink,
    setNumberOrLink,
    dayPicked,
    setDayPicked,
    timePicked,
    setTimePicked,
    errorMessage,
    setErrorMessage,
  } = useContext(ContextChannelForm);

  const onPressPickDay = index => {
    let data = {
      index,
      min: index ? 1 : 2,
      max: index ? 7 : 6,
    };
    setDayPicked(data);
  };

  const onPressPickTime = index => {
    let data = {
      index,
      min: index ? '13:00' : '08:00',
      max: index ? '17:00' : '12:00',
    };
    setTimePicked(data);
  };

  const changeNumberOrLink = value => {
    if (isMobileNumber) {
      let mobile = value.replace(/[^0-9]/g, '');
      if (mobile.length > 11) return;
      if (value[0] != '0' || value[1] != '9') {
        setNumberOrLink('09');
      } else {
        setNumberOrLink(mobile);
      }
    } else {
      setNumberOrLink(value);
    }
  };

  return (
    <View style={styles.containerShadow}>
      <TextInput
        keyboardType={isMobileNumber ? 'number-pad' : 'default'}
        value={numberOrLink}
        placeholder={`Enter ${placeholder}`}
        style={[styles.input, {borderWidth: 1, borderColor: errorMessage == '' ? 'transparent' : COLOR.RED}]}
        onChangeText={changeNumberOrLink}
        returnKeyType="done"
        placeholderTextColor="#9E9E9E"
        maxLength={isMobileNumber ? 11 : null}
      />
      {errorMessage != '' && (
        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S, color: COLOR.RED, marginTop: 5}}>
          {errorMessage}
        </Text>
      )}
      <Text style={{marginTop: 15, marginBottom: 5, fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.M}}>
        Pick Day and Time
      </Text>
      <View style={styles.contentShadow}>
        <Text style={{marginBottom: 10, fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.M, color: '#525252'}}>Day</Text>
        <View style={{height: 1, backgroundColor: '#F8F8F8', marginBottom: 16}} />
        <CustomRadioButton data={DAY_LIST} selected={dayPicked.index} onPress={onPressPickDay} />
      </View>
      <View style={[styles.contentShadow, {marginTop: 16}]}>
        <Text style={{marginBottom: 10, fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.M, color: '#525252'}}>
          Time
        </Text>
        <View style={{height: 1, backgroundColor: '#F8F8F8', marginBottom: 16}} />
        <CustomRadioButton data={TIME_LIST} selected={timePicked.index} onPress={onPressPickTime} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F8F8F8',
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  contentShadow: {
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1.5,
    zIndex: 1,
    padding: 16,
  },
  containerShadow: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 1,
    padding: 16,
  },
});
