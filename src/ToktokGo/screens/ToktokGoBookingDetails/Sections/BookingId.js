import React from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import constants from '../../../../common/res/constants';
import {APP_FLAVOR, DARK, FONTS, MEDIUM} from '../../../../res/constants';
import {FONT} from '../../../../res/variables';
import OnGoingIcon from '../../../../assets/icons/OnGoing.png';
import CompletedIcon from '../../../../assets/icons/Completed.png';
import CancelledIcon from '../../../../assets/icons/Cancelled.png';

export const BookingID = ({delivery, booking}) => {
  const getTextStatus = () => {
    if (booking.tag == 'ONGOING') return 'Ongoing';
    else if (booking.tag == 'COMPLETED') return 'Completed';
    else if (booking.tag == 'CANCELLED') return 'Cancelled';
  };

  const getIconStatus = () => {
    if (booking.tag == 'ONGOING') return OnGoingIcon;
    else if (booking.tag == 'COMPLETED') return CompletedIcon;
    else if (booking.tag == 'CANCELLED') return CancelledIcon;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: DARK, fontFamily: FONTS.BOLD, fontSize: constants.FONT_SIZE.M}}>Booking ID</Text>
            <Text
              style={{
                color: constants.COLOR.ORANGE,
                fontSize: constants.FONT_SIZE.M,
                fontFamily: FONTS.REGULAR,
                marginLeft: 10,
              }}>
              {booking.id}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={getIconStatus()} style={{height: 20, width: 20, marginRight: 10}} resizeMode={'contain'} />
            <Text
              style={{
                fontFamily: constants.FONT_FAMILY.BOLD,
                fontSize: constants.FONT_SIZE.M,
                color: delivery.status != 7 ? constants.COLOR.ORANGE : constants.COLOR.RED,
              }}>
              {getTextStatus()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  cardShadow: {
    padding: 16,
    backgroundColor: constants.COLOR.LIGHT_YELLOW,
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  items: {
    fontFamily: FONT.REGULAR,
    color: constants.COLOR.DARK,
    fontSize: constants.FONT_SIZE.M,
    marginTop: 2,
  },
});
