import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import {ThrottledWithoutFeedback} from 'common/components';
import {VectorIcon, ICON_SET} from 'src/revamp';

import CONSTANTS from 'common/res/constants';
import ASSETS from 'toktok/assets';

const VEHICLE_IMAGE_CLASS = {
  Motorcycle: ASSETS.Vehicles.Motorcycle,
  Sedan: ASSETS.Vehicles.Sedan,
  XUV: ASSETS.Vehicles.XUV,
  MPV: ASSETS.Vehicles.MPV,
  Van: ASSETS.Vehicles.Van,
  Aluminum: ASSETS.Vehicles.Aluminum,
};

export const VehicleType = ({item, index, data, selectedVehicleType, setSelectedVehicleType}) => {
  const isSelected = item.id === selectedVehicleType.id ? true : false;

  const vehicleCardVerticalMargin = {
    marginTop: index === 0 ? CONSTANTS.MARGIN.M : 0,
    marginBottom: index + 1 === data.length ? CONSTANTS.MARGIN.M : 0,
    borderColor: isSelected ? CONSTANTS.COLOR.ORANGE : CONSTANTS.COLOR.WHITE,
  };

  const vehicleDetailsStyle = {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 2,
    // backgroundColor: isSelected ? CONSTANTS.COLOR.TRANSPARENT_ORANGE : 'white',
  };

  return (
    <View style={[styles.vehicleCard, vehicleCardVerticalMargin]}>
      <ThrottledWithoutFeedback
        onPress={() => {
          console.log({item});
          setSelectedVehicleType(item);
        }}
        delay={100}>
        <View style={styles.vehicleCardBody}>
          <Image
            source={{uri: VEHICLE_IMAGE_CLASS[item.imageClass]}}
            style={styles.vehicleImage}
            resizeMode={'contain'}
          />
          <View style={vehicleDetailsStyle}>
            <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.BOLD}}>{item.name}</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{item.phrase}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <VectorIcon name="box" iconSet={ICON_SET.Feather} size={12} style={{marginRight: 4}} />
              <Text
                style={{
                  fontSize: CONSTANTS.FONT_SIZE.S,
                }}>{`${item.cargoMaxLength} x ${item.cargoMaxWidth} x ${item.cargoMaxHeight} meter`}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <VectorIcon name="weight-hanging" iconSet={ICON_SET.FontAwesome5} size={12} style={{marginRight: 4}} />
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{`Up to ${item.cargoWeightCapacity} kg`}</Text>
            </View>
          </View>
        </View>
      </ThrottledWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    height: 110,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: CONSTANTS.MARGIN.M,
    borderRadius: CONSTANTS.SIZE.BORDER_RADIUS,
    overflow: 'hidden',
    ...CONSTANTS.SHADOW,
    borderWidth: 2,
    borderColor: 'white',
  },
  vehicleCardBody: {
    flexDirection: 'row',
    flex: 1,
  },
  vehicleImage: {
    height: 110,
    width: 160,
    backgroundColor: CONSTANTS.COLOR.TRANSPARENT_ORANGE,
  },
});
