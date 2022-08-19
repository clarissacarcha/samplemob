import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, Dimensions, Platform} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import CONSTANTS from '../../common/res/constants';
import {numberFormat} from '../../helper';
import SedanIMG from '../../assets/images/vehicleTypes/Sedan.png';
import SmallMpvIMG from '../../assets/images/vehicleTypes/SmallMPV.png';
import LargeMpvIMG from '../../assets/images/vehicleTypes/LargeMPV.png';

const ImageWidth = (Dimensions.get('window').width - 230) / 2;

export const VehicleCard = ({type, loading, data, selectVehicle, setDataVehicle, selectedVehicle, dataVehicle}) => {
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const render_image = () => {
    switch (data?.vehicleType?.imageClass) {
      case 'SEDAN': {
        return SedanIMG;
      }
      case 'SMPV': {
        return SmallMpvIMG;
      }
      case 'LMPV': {
        return LargeMpvIMG;
      }
    }
  };

  const setVehicle = () => {
    if (type) {
      setDataVehicle(data);
    } else {
      selectVehicle(data);
    }
  };

  const getSelectStyle = () => {
    if (!type && data?.vehicleType?.id == selectedVehicle?.vehicleType?.id) {
      return styles.selected;
    } else {
      if (data?.vehicleType?.id == dataVehicle?.vehicleType?.id) {
        return styles.selected;
      } else {
        return {
          paddingHorizontal: 16,
        };
      }
    }
  };

  const seeVehicleFees = () => {
    if (data?.vehicleType?.id == dataVehicle?.vehicleType?.id && type) {
      return (
        <View style={styles.priceDetails}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.fareText}>Base fare</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{'₱ ' + numberFormat(data?.vehicleType?.flatRate)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.kmText}>Per KM</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{'₱ ' + numberFormat(data?.vehicleType?.perKm)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.durationText}>Per minute</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{'₱ ' + numberFormat(data?.vehicleType?.perMin)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.surgeText}>Max Surge Charge</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{'1.5 - 2.0'}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={setVehicle} style={getSelectStyle()}>
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
          <View style={{flex: 1}}>
            <View style={{alignSelf: 'flex-end'}}>
              <ShimmerPlaceHolder
                style={{width: !loading ? (Platform.OS == 'ios' ? '100%' : 75) : 45}}
                visible={!loading}>
                <Text style={styles.priceTextStyle}>₱{numberFormat(data?.rate?.amount)}</Text>
              </ShimmerPlaceHolder>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {seeVehicleFees()}
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  carTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginRight: 84,
  },
  durationText: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginRight: 63.5,
  },
  surgeText: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginRight: 28.5,
  },
  fareText: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginRight: 72,
  },
  priceDetails: {
    borderRadius: 5,
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
});
