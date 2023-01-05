import React from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {LocationCard} from '../../../../../ToktokGo/components';
export const RecentSearch = ({navigation, popTo, recentSearchDataList, onPressRecentSearch}) => {
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
        renderItem={({item, index}) => (
          <LocationCard item={item} onPress={onPressRecentSearch} navigation={navigation} />
        )}
      />
    </>
  );
};
