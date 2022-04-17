import React from 'react';
import {StyleSheet, View} from 'react-native';
import constants from '../../../../common/res/constants';
import {AccordionBooking} from '../Components';
import {numberFormat} from '../../../../helper';

export const TotalBreakdown = ({booking}) => {
  return (
    <View style={styles.card}>
      <View style={styles.directionsBox}>
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
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsBox: {
    justifyContent: 'space-between',
  },
});
