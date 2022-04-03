import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../common/res/constants';
import {numberFormat} from '../../helper';

import SedanIMG from '../../assets/images/Sedan.png';
import SuvIMG from '../../assets/images/SUV.png';
import MpvIMG from '../../assets/images/MPV2.png';
import VanIMG from '../../assets/images/Van.png';

export const VehicleCard = ({type, data, selectedVehicle, setSelectedVehicle}) => {
  const render_image = type => {
    switch (type) {
      case '1': {
        return null;
      }
      case '2': {
        return SedanIMG;
      }
      case '3': {
        return MpvIMG;
      }
      case '4': {
        return VanIMG;
      }
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setSelectedVehicle(data?.vehicleType?.id)}
        style={data?.vehicleType?.id == selectedVehicle ? styles.selected : {paddingHorizontal: 16}}>
        <View style={styles.container}>
          <View style={styles.elementWrapper}>
            <Image
              source={render_image(data?.vehicleType?.id)}
              resizeMode={'contain'}
              style={{width: 115, height: 70}}
            />
            <View style={{marginLeft: 15}}>
              <Text style={styles.carTextStyle}>{data?.vehicleType?.name}</Text>
              <Text style={styles.descTextStlye}>{data?.vehicleType?.phrase}</Text>
            </View>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.priceTextStyle}>₱{numberFormat(data?.rate?.amount)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {data?.vehicleType?.id == selectedVehicle && type && (
        <View style={styles.priceDetails}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.fareText}>Base fare</Text>
            <Text>₱{numberFormat(data?.rate?.flatRate)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.kmText}>Per KM</Text>
            <Text>₱{numberFormat(data?.rate?.mileageFee)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
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
  priceTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginLeft: 10,
  },
  carTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  descTextStlye: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  selected: {
    paddingHorizontal: 16,
    zIndex: 999,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  kmText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginRight: 30,
  },
  fareText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginRight: 20,
  },
  priceDetails: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
});
