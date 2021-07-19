import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {YellowButton, Shadow} from '../../../../../revamp';
import CONSTANTS from 'common/res/constants';
import ASSETS from 'toktok/assets';

const VehicleType = () => {
  return (
    <View style={styles.vehicleCard}>
      <Image source={{uri: ASSETS.Vehicles.Motorcycle}} style={styles.vehicleImage} resizeMode={'contain'} />
    </View>
  );
};

export const ToktokVehicleInformation = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Select', 'Vehicle']} />,
  });

  return (
    <View style={styles.screen}>
      <View style={{flex: 1}}>
        <VehicleType />
      </View>
      <View style={{backgroundColor: '#F7F7FA'}}>
        <YellowButton label="Select Vehicle" onPress={() => {}} style={{margin: 16}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  vehicleCard: {
    height: 100,
    backgroundColor: 'white',
    marginHorizontal: CONSTANTS.MARGIN.M,
    borderWidth: 1,
    borderRadius: CONSTANTS.SIZE.BORDER_RADIUS,
    borderColor: CONSTANTS.COLOR.MEDIUM,
    overflow: 'hidden',
  },
  vehicleImage: {
    height: 98,
    width: 150,
    backgroundColor: CONSTANTS.COLOR.TRANSPARENT_YELLOW,
  },
});
