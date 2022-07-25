import React from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Data from '../../../components/BookingDummyData';
import {LocationCard} from '../../../components';
import AsyncStorage from '@react-native-community/async-storage';
export const FrequentlyUsed = ({navigation, popTo, recentSearchDataList, goTo}) => {
  const onPressLocation = () => {
    navigation.push('ToktokGoBookingConfirmPickup', {
      popTo: popTo + 1,
    });
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: CONSTANTS.COLOR.WHITE,
        }}>
        <Text
          style={{
            fontSize: CONSTANTS.FONT_SIZE.M,
            color: CONSTANTS.COLOR.ORANGE,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
          }}>
          Recent Search
        </Text>
        <TouchableOpacity onPress={() => navigation.push('ToktokGoFrequentlyUsed')}>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.M,
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
              }}>
              See All
            </Text>
            <MIcon name={'keyboard-arrow-right'} size={23} color={CONSTANTS.COLOR.ORANGE} style={{marginRight: -7}} />
          </View> */}
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={recentSearchDataList}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => <LocationCard item={item} onPress={goTo} />}
      />
    </>
  );
};
