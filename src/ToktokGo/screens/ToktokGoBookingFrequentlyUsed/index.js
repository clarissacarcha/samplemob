import React from 'react';
import {Text, View, FlatList} from 'react-native';
import Data from '../../components/BookingDummyData';
import CONSTANTS from '../../../common/res/constants';
import {LocationCard, Header} from '../../components';

const ToktokGoFrequentlyUsed = ({navigation}) => {
  const onPressLocation = () => {
    navigation.push('ToktokGoBookingConfirmPickup', {
      popTo: 3,
    });
  };

  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1}}>
      <Header navigation={navigation} title={'Frequently Used'} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Data.frequentlyUsed}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == Data.frequentlyUsed.length - 1 ? true : false;
          return <LocationCard item={item} lastItem={lastItem} onPress={onPressLocation} />;
        }}
      />
    </View>
  );
};

export default ToktokGoFrequentlyUsed;
