import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import NoDataImage from 'toktokwallet/assets/images/no-record.png';
import NoNotifImage from 'toktokwallet/assets/images/no-notif.png';
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const imageWidth = 200;

export const NoData = ({
  title = 'No Record Found',
  label = 'You have no transactions at the moment.',
  type = 'data',
}) => {
  let img = null;

  switch (type) {
    case 'data':
      img = NoDataImage;
      break;
    case 'notification':
      img = NoNotifImage;
      break;
    default:
      break;
  }

  return (
    <View style={styles.center}>
      <Image source={img} style={styles.image} resizeMode={'contain'} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: moderateScale(imageWidth),
    width: moderateScale(imageWidth),
  },
  text: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    color: 'black',
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(FONT_SIZE.XL),
    color: COLOR.ORANGE,
    marginVertical: 8,
  },
});
