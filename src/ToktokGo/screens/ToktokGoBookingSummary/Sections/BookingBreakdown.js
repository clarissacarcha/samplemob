import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import InfoIcon from '../../../../assets/icons/InfoIcon.png';
import {numberFormat} from '../../../../helper';

export const BookingBreakdown = ({selectedVehicle, loading}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title}>Ride Fare</Text>
        {loading ? (
          <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
        ) : (
          <Text>₱ {numberFormat(selectedVehicle?.rate?.amount ? selectedVehicle?.rate?.amount : 0)}</Text>
        )}
      </View>

      {/* todo: Condition here */}
      {false && (
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.fee}>
              <Text style={styles.title}>Outstanding Fee</Text>
              <Image source={InfoIcon} resizeMode={'contain'} style={styles.iconDimensions} />
            </View>
            <Text>₱{' data here'}</Text>
          </View>
          <View style={styles.feeDate}>
            <Text>Cancellation Fee last Jan 7, 2022</Text>
          </View>

          <View style={styles.rowContainer}>
            <Text style={styles.title}>Voucher Applied</Text>
            <Text style={styles.redText}>- ₱{' data here'}</Text>
          </View>
        </View>
      )}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 19,
    flexDirection: 'column',
  },
  title: {
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fee: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconDimensions: {
    marginLeft: 5,
    height: 13,
    width: 13,
  },
  feeDate: {
    marginTop: -8,
    marginBottom: 16,
  },
  redText: {
    color: CONSTANTS.COLOR.RED,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
});
