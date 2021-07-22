import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import {ThrottledWithoutFeedback} from 'common/components';

import CONSTANTS from 'common/res/constants';
import ASSETS from 'toktok/assets';

const vehicleNameImage = [
  {name: 'Motorcycle', image: ASSETS.Vehicles.Motorcycle},
  {name: 'Sedan', image: ASSETS.Vehicles.Sedan},
  {name: 'MPV', image: ASSETS.Vehicles.MPV},
  {name: 'Van', image: ASSETS.Vehicles.Van},
  {name: 'Truck', image: ASSETS.Vehicles.Truck},
];

export const VehicleType = ({item, index, data, selectedVehicleType, setSelectedVehicleType}) => {
  const isSelected = item.id === selectedVehicleType.id ? true : false;

  let vehicleImage = ASSETS.Vehicles.Motorcycle;

  vehicleNameImage.map((type) => {
    if (item.type.includes(type.name)) {
      vehicleImage = type.image;
    }
  });

  const vehicleCardVerticalMargin = {
    marginTop: index === 0 ? CONSTANTS.MARGIN.M : 0,
    marginBottom: index + 1 === data.length ? CONSTANTS.MARGIN.M : 0,
    borderColor: isSelected ? CONSTANTS.COLOR.ORANGE : CONSTANTS.COLOR.WHITE,
  };

  const vehicleDetailsStyle = {
    flex: 1,
    padding: 16,
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
          <Image source={{uri: vehicleImage}} style={styles.vehicleImage} resizeMode={'contain'} />
          <View style={vehicleDetailsStyle}>
            <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.BOLD}}>{item.name}</Text>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{item.phrase}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>{`Max weight: ${item.cargoWeightCapacity} KG`}</Text>
              {/* <Text style={{color: CONSTANTS.COLOR.YELLOW}}>{`PHP ${item.flatRate}`}</Text> */}
            </View>
          </View>
        </View>
      </ThrottledWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    height: 100,
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
    height: 100,
    width: 150,
    backgroundColor: CONSTANTS.COLOR.TRANSPARENT_ORANGE,
  },
});
