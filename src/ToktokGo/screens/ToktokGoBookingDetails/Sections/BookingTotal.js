import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import constants from '../../../../common/res/constants';
import {APP_FLAVOR, MEDIUM} from '../../../../res/constants';
import {FONT} from '../../../../res/variables';
// import CashImage from '../../../../assets/toktok/images/Cash.png';
// import ToktokIcon from '../../../../assets/toktok/images/ToktokIcon.png';
import {AccordionBooking} from '.';
import {numberFormat} from '../../../../helper';

export const BookingTotal = ({details, booking}) => {
  return (
    <View style={styles.card}>
      <View style={styles.directionsBox}>
        <View style={{borderBottomWidth: 1, borderColor: constants.COLOR.LIGHT, marginBottom: 10}} />
        <View style={styles.directionDetail}>
          {/*-------------------- TOTAL INCOME --------------------*/}
          <View style={{flex: 1}}>
            <AccordionBooking
              titleText={'Total'}
              titleAmount={'₱ ' + numberFormat(booking.fare.total)}
              subTexts={[
                {amount: `₱${numberFormat(booking.fare.flatRate)}`, text: 'Sedan', key: 1},
                {amount: `₱${numberFormat(booking.fare.mileageFee)}`, text: 'Distance', key: 2},
                {amount: `₱${numberFormat(booking.fare.durationFee)}`, text: 'Duration', key: 2},
              ]}
              dummyStatus={2}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: constants.COLOR.WHITE,
    // alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsBox: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  items: {
    fontFamily: FONT.REGULAR,
    color: constants.COLOR.DARK,
    fontSize: constants.FONT_SIZE.M,
    marginTop: 2,
  },
  deliveryFee: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderColor: constants.COLOR.LIGHT,
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
