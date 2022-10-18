import React from 'react';
import {Text, View, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/dist/MaterialIcons';
import Data from '../../../components/BookingDummyData';
import {SavedAddressCard} from '../../../components';
import normalize from 'react-native-normalize';
export const SavedAddress = ({navigation, savedAddressList, navigateToSavedAddress, onPressSavedAddress}) => {
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
              //   marginTop: savedAddressList.length == 0 ? 0 : 16,
              // paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.M,
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                marginLeft: 7,
              }}>
              Saved Address
            </Text>
            {savedAddressList.length == 3 && (
              <TouchableOpacity onPress={navigateToSavedAddress} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: CONSTANTS.FONT_SIZE.M,
                    color: CONSTANTS.COLOR.ORANGE,
                    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                    marginLeft: 7,
                  }}>
                  See All
                </Text>
                <MIcon name="keyboard-arrow-right" color="#F6841F" size={normalize(18)} />
              </TouchableOpacity>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        data={savedAddressList}
        // keyExtractor={item => item.id}
        listKey={item => item.id}
        renderItem={({item, index}) => <SavedAddressCard item={item} onPress={onPressSavedAddress} />}
      />
    </SafeAreaView>
  );
};
