import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import {VehicleCard} from '../../../components';
import CONSTANTS from '../../../../common/res/constants';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import SedanIMG from '../../../../assets/images/Sedan.png';
import SUVIMG from '../../../../assets/images/SUV.png';

export const BookingSelectVehicle = ({data, setSelectedVehicle, selectedVehicle}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Text style={styles.textStyle}>Select Vehicle</Text>
        </View>

        <TouchableOpacity style={styles.elementWrapper}>
          <Text style={styles.seeAlltextStyle}>See All</Text>
          <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setSelectedVehicle(1)}
        style={selectedVehicle === 1 ? styles.selected : {marginTop: 16}}>
        <VehicleCard isSelected={true} carImage={SedanIMG} data={data[0]} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setSelectedVehicle(2)}
        style={selectedVehicle === 2 ? styles.selected : {marginTop: 16}}>
        <VehicleCard isSelected={false} carImage={SUVIMG} data={data[1]} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
});
