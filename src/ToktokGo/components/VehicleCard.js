import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../common/res/constants';
import {numberFormat} from '../../helper';
import {useDispatch, useSelector} from 'react-redux';
import SedanIMG from '../../assets/images/vehicleTypes/Sedan.png';
import SmallMpvIMG from '../../assets/images/vehicleTypes/SmallMPV.png';
import LargeMpvIMG from '../../assets/images/vehicleTypes/LargeMPV.png';

const ImageWidth = (Dimensions.get('window').width - 230) / 2;

export const VehicleCard = ({type, data}) => {
  const {details} = useSelector(state => state.toktokGo);
  const dispatch = useDispatch();
  const render_image = type => {
    switch (type) {
      case '1': {
        return SedanIMG;
      }
      case '2': {
        return SmallMpvIMG;
      }
      case '3': {
        return LargeMpvIMG;
      }
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          dispatch({
            type: 'SET_TOKTOKGO_BOOKING_DETAILS',
            payload: {...details, vehicleType: data.vehicleType, rate: data.rate},
          });
        }}
        style={data?.vehicleType?.id == details.vehicleType.id ? styles.selected : {paddingHorizontal: 16}}>
        <View style={styles.container}>
          <View style={styles.elementWrapper}>
            <Image
              source={render_image(data?.vehicleType?.id)}
              resizeMode={'contain'}
              style={{width: ImageWidth, height: ImageWidth}}
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
      {data?.vehicleType?.id == details.vehicleType.id && type && (
        <View style={styles.priceDetails}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.fareText}>Base fare</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>₱{numberFormat(data?.rate?.flatRate)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.kmText}>Per KM</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>₱{numberFormat(data?.rate?.mileageFee)}</Text>
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
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  elementWrapper: {
    marginVertical: -10,
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
    borderRadius: 5,
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
});
