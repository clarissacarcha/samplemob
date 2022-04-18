import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import Data from '../../components/BookingDummyData';
import CONSTANTS from '../../../common/res/constants';
import {Header, VehicleCard} from '../../components';
import {useSelector} from 'react-redux';

const ToktokGoBookingVehicle = ({navigation, route}) => {
  const {data, selectVehicle, loading, selectedVehicle} = route.params;
  const [selectedVehicleType, setSelectedVehicle] = useState(selectedVehicle);
  const [localLoading, setLocalLoading] = useState(loading);

  const {details} = useSelector(state => state.toktokGo);

  const onSelectVehicle = data => {
    setLocalLoading(true);
    setSelectedVehicle(data);
    selectVehicle(data);
  };

  useEffect(() => {
    setTimeout(() => {
      setLocalLoading(false);
    }, 1200);
  }, [details]);

  return (
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE}}>
      <Header navigation={navigation} title={'Select Vehicle'} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.vehicleTypeRates}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == data.vehicleTypeRates.length - 1 ? true : false;
          return (
            <View style={{marginHorizontal: 16}}>
              <VehicleCard
                type={'isFromSeeAll'}
                data={item}
                selectVehicle={onSelectVehicle}
                selectedVehicle={selectedVehicleType}
                loading={localLoading}
                lastItem={lastItem}
              />
            </View>
          );
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Select Vehicle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToktokGoBookingVehicle;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 16,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  buttonStyle: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
