import React from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Data from '../../../components/BookingDummyData';
import {LocationCard} from '../../../components';
export const FrequentlyUsed = ({navigation}) => {
  const onPressLocation = () => {
    navigation.push('ToktokGoBookingConfirmPickup', {
      popTo: 2,
    });
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 13,
          paddingVertical: 10,
          backgroundColor: CONSTANTS.COLOR.WHITE,
        }}>
        <Text
          style={{
            fontSize: CONSTANTS.FONT_SIZE.M,
            color: CONSTANTS.COLOR.ORANGE,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
            marginLeft: 7,
          }}>
          Frequently Used
        </Text>
        <TouchableOpacity onPress={() => navigation.push('ToktokGoFrequentlyUsed')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.M,
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
              }}>
              See All
            </Text>
            <MIcon name={'keyboard-arrow-right'} size={23} color={CONSTANTS.COLOR.ORANGE} />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Data.frequentlyUsed}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => <LocationCard item={item} onPress={onPressLocation} />}
      />
    </>
  );
};
