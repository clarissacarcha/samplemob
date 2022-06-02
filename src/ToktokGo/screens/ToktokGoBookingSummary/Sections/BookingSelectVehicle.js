import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import {VehicleCard} from '../../../components';
import CONSTANTS from '../../../../common/res/constants';
import {useSelector} from 'react-redux';
import InfoIcon from '../../../../assets/images/info.png';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import {ThrottledOpacity} from '../../../../components_section';

export const BookingSelectVehicle = ({navigation, data, selectVehicle, selectedVehicle, setViewPriceNote}) => {
  const {tempVehicleArr} = useSelector(state => state.toktokGo);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Text style={styles.textStyle}>Select Vehicle</Text>
          <ThrottledOpacity
            onPress={() => {
              setViewPriceNote(true);
            }}>
            <Image source={InfoIcon} resizeMode={'contain'} style={{width: 13, height: 13}} />
          </ThrottledOpacity>
        </View>

        <ThrottledOpacity
          onPress={() =>
            navigation.push('ToktokGoBookingVehicle', {
              data,
              selectVehicle,
              selectedVehicle,
            })
          }
          style={styles.elementWrapper}>
          <Text style={styles.seeAlltextStyle}>See All</Text>
          <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
        </ThrottledOpacity>
      </View>

      <VehicleCard data={tempVehicleArr[0]} selectVehicle={selectVehicle} selectedVehicle={selectedVehicle} />
      <VehicleCard data={tempVehicleArr[1]} selectVehicle={selectVehicle} selectedVehicle={selectedVehicle} />

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
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginRight: 8,
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
