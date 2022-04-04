import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import {VehicleCard} from '../../../components';
import CONSTANTS from '../../../../common/res/constants';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';

export const BookingSelectVehicle = ({navigation, data}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Text style={styles.textStyle}>Select Vehicle</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.push('ToktokGoBookingVehicle', {data})}
          style={styles.elementWrapper}>
          <Text style={styles.seeAlltextStyle}>See All</Text>
          <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
        </TouchableOpacity>
      </View>

      <VehicleCard data={data.vehicleTypeRates?.[0]} />
      <VehicleCard data={data.vehicleTypeRates?.[1]} />

      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  elementWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.BLACK,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  seeAlltextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginLeft: 10,
  },
  arrowIconStyle: {
    height: 9,
    width: 6,
    marginLeft: 10,
  },
  selected: {
    borderRadius: 5,
    marginTop: 16,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginBottom: 16,
    marginHorizontal: -16,
  },
});
