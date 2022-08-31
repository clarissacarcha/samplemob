import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const FinishRequirement = ({finishLabel, btnLabel, onPress, disabled, imgSource, checkVcs}) => {
  const RequestVideoCallSchedule = () => {
    const {
      preferredVcsDayMin,
      preferredVcsDayMax,
      preferredVcsTimeMin,
      preferredVcsTimeMax,
      videoCallContactDetails,
      callChannel,
    } = checkVcs.request;
    const startDay = preferredVcsDayMin;
    const endDay = preferredVcsDayMax;

    let dayTitle = '';
    let dayRange = '';

    if (startDay === 1 && endDay === 7) {
      dayTitle = 'Weekend';
      dayRange = 'Saturday-Sunday';
    }

    if (startDay === 2 && endDay === 6) {
      dayTitle = 'Weekday';
      dayRange = 'Monday-Friday';
    }

    const startTime = moment(preferredVcsTimeMin, 'hh:mm:ss').format('hh:mm A');
    const endTime = moment(preferredVcsTimeMax, 'hh:mm:ss').format('hh:mm A');
    const timeRange = `${startTime} - ${endTime}`;

    return (
      <View style={{marginTop: 10}}>
        <Text style={{fontSize: FONT_SIZE.S}}>
          <Text style={{fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.S}}>{callChannel.channelName}: </Text>
          {videoCallContactDetails}
        </Text>
        <Text style={{fontSize: FONT_SIZE.S}}>
          <Text style={{fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.S}}>{dayTitle}: </Text>
          {dayRange}
        </Text>
        <Text style={{fontSize: FONT_SIZE.S}}>
          <Text style={{fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.S}}>Time: </Text>
          {timeRange}
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={[styles.cardShadow, styles.cardStyle, !checkVcs?.request && {alignItems: 'center'}]}>
        <Image source={imgSource} style={styles.img} />
        <View style={{marginLeft: 15, flexShrink: 1, flex: 1}}>
          <Text style={[styles.fontRegularStyle]}>{finishLabel}</Text>
          {checkVcs?.request && <RequestVideoCallSchedule />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fontRegularStyle: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
  },
  fontBoldStyle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  linkNow: {
    fontSize: FONT_SIZE.XS,
    color: COLOR.ORANGE,
  },
  cardShadow: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardStyle: {
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonStyle: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
  },
  img: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
  },
});
