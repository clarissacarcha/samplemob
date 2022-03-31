import React from 'react';
import {Text, View, FlatList} from 'react-native';
import Data from '../../components/BookingDummyData';
import CONSTANTS from '../../../common/res/constants';
import {Header, VehicleCard} from '../../components';

const ToktokGoBookingVehicle = ({navigation}) => {
  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1}}>
      <Header navigation={navigation} title={'Select Vehicle'} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Data.vehicles}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == Data.frequentlyUsed.length - 1 ? true : false;
          return <VehicleCard data={item} lastItem={lastItem} />;
        }}
      />
    </View>
  );
};

export default ToktokGoBookingVehicle;
