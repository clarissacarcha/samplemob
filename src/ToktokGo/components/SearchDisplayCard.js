import React from 'react';
import {Text, View, FlatList, Image, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../common/res/constants';
export const SearchDisplayCard = ({item, onPress, onSelectPlace, lastItem = false}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => onSelectPlace(item)}
        style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row', paddingRight: 0}}>
          <View>
            {/* <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>{title}</Text> */}
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.S,
                color: CONSTANTS.COLOR.ALMOST_BLACK,
              }}>
              {item.formattedAddress}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {!lastItem && <View style={{borderBottomWidth: 2, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />}
    </>
  );
};
