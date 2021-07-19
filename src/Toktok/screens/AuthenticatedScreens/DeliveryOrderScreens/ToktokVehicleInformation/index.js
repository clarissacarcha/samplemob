import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {HeaderBack, HeaderTitle} from 'src/components';
import {YellowButton} from 'src/revamp';
import CONSTANTS from 'common/res/constants';

import {VehicleType} from './components/';

export const ToktokVehicleInformation = ({navigation, route}) => {
  const {vehicleTypesData, orderData, setOrderData} = route.params;
  const [selectedVehicleType, setSelectedVehicleType] = useState({id: null});

  console.log(JSON.stringify({orderData}, null, 4));

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Select', 'Vehicle']} />,
  });

  const onVehicleSelected = () => {
    const updatedOrderData = {
      ...orderData,
      vehicleTypeId: selectedVehicleType.id,
    };

    navigation.push('DeliveryDetails', {
      orderData: updatedOrderData,
      setOrderData,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.screenBody}>
        <FlatList
          data={vehicleTypesData}
          renderItem={({item, index}) => (
            <VehicleType
              item={item}
              index={index}
              data={vehicleTypesData}
              selectedVehicleType={selectedVehicleType}
              setSelectedVehicleType={setSelectedVehicleType}
            />
          )}
          ItemSeparatorComponent={() => <View style={{height: CONSTANTS.MARGIN.M}} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {selectedVehicleType.id ? (
        <View style={styles.buttonBox}>
          <YellowButton label="Select Vehicle" onPress={onVehicleSelected} style={{margin: CONSTANTS.MARGIN.M}} />
        </View>
      ) : (
        <View style={styles.buttonBox}>
          <YellowButton
            label="Select Vehicle"
            onPress={() => {}}
            style={{margin: CONSTANTS.MARGIN.M, backgroundColor: CONSTANTS.COLOR.MEDIUM}}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  screenBody: {
    flex: 1,
  },
  buttonBox: {
    backgroundColor: '#F7F7FA',
  },
});
