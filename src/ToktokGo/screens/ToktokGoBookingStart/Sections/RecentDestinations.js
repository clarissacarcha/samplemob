import React from 'react';
import {Text, View, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Data from '../../../components/BookingDummyData';
import {LocationCard} from '../../../components';
export const RecentDestinations = ({
  navigation,
  onPressRecentDestination,
  recentDestinationList,
  recentSearchDataList,
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 13,
              backgroundColor: CONSTANTS.COLOR.WHITE,
              marginTop: recentSearchDataList.length == 0 ? 0 : 16,
              // paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.M,
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                marginLeft: 7,
              }}>
              Recent Destinations
            </Text>
            <TouchableOpacity onPress={() => navigation.push('ToktokGoRecentDestinations')}></TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        data={recentDestinationList}
        // keyExtractor={item => item.id}
        listKey={item => item.id}
        renderItem={({item, index}) => <LocationCard item={item} onPress={onPressRecentDestination} />}
      />
    </SafeAreaView>
  );
};
