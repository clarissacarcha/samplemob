import React from 'react';
import {Text, View, FlatList, TouchableHighlight, Dimensions, StyleSheet} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Data from '../../../components/BookingDummyData';
import Home from '../../../../assets/icons/home-address-icon.png';
import Office from '../../../../assets/icons/office-address-icon.png';
import {LocationCard} from '../../../components';
export const SavedLocations = () => {
  const height = Dimensions.get('window').height / 4;

  return (
    <>
      <TouchableHighlight onPress={() => console.log('trigger')}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 13,
            backgroundColor: CONSTANTS.COLOR.WHITE,
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontSize: CONSTANTS.FONT_SIZE.M,
              color: CONSTANTS.COLOR.ORANGE,
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              marginLeft: 7,
            }}>
            Saved Locations
          </Text>
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
        </View>
      </TouchableHighlight>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Data.savedLocations}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => <LocationCard item={item} image={item.name === 'Home' ? Home : Office} />}
      />
    </>
  );
};
