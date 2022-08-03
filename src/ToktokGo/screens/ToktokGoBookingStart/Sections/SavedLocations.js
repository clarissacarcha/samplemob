import React from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Data from '../../../components/BookingDummyData';
import Home from '../../../../assets/icons/home-address-icon.png';
import Office from '../../../../assets/icons/office-address-icon.png';
import {LocationCard} from '../../../components';

export const SavedLocations = ({navigation, popTo, recentSearchDataList, onPressRecentSearch}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 13,
          backgroundColor: CONSTANTS.COLOR.WHITE,
          // paddingVertical: 10,
        }}>
        <Text
          style={{
            fontSize: CONSTANTS.FONT_SIZE.M,
            color: CONSTANTS.COLOR.ORANGE,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
            marginLeft: 7,
          }}>
          Recent Search
        </Text>
        <TouchableOpacity onPress={() => console.log('trigger')}>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.M,
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
              }}>
              See All
            </Text>
            <MIcon name={'keyboard-arrow-right'} size={23} color={CONSTANTS.COLOR.ORANGE} />
          </View> */}
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={recentSearchDataList}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => <LocationCard item={item} onPress={onPressRecentSearch} />}
      />
    </>
  );
};
