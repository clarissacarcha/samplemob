import React, {useState} from 'react';
import {Text, View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {useSelector, useDispatch} from 'react-redux';
import {Header, VehicleCard} from '../../components';

const ToktokGoBookingVehicle = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {tempVehicleArr} = useSelector(state => state.toktokGo);
  const {data, selectVehicle, selectedVehicle} = route.params;
  const [dataVehicle, setDataVehicle] = useState(selectedVehicle);

  const handleSelect = () => {
    navigation.pop();
    selectVehicle(dataVehicle);
    let check = tempVehicleArr.includes(dataVehicle);
    if (dataVehicle && !check) {
      tempVehicleArr.unshift(dataVehicle);
      tempVehicleArr.pop();
      dispatch({
        type: 'SET_TOKTOKGO_TEMP_VEHICLE_LIST',
        payload: tempVehicleArr,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE}}>
      <Header navigation={navigation} title={'Select Vehicle'} />
      <FlatList
        style={{marginTop: 24}}
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
                selectVehicle={selectVehicle}
                selectedVehicle={selectedVehicle}
                setDataVehicle={setDataVehicle}
                dataVehicle={dataVehicle}
              />
            </View>
          );
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSelect} style={styles.buttonStyle}>
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
