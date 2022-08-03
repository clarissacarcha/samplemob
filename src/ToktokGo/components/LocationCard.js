import React from 'react';
import {Text, View, FlatList, Image, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../common/res/constants';
export const LocationCard = ({item, image, onPress, lastItem = false}) => {
  // console.log(item);
  return (
    <>
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row', paddingRight: image ? 20 : 0}}>
          {image && <Image source={image} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />}
          <View>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>
              {item.place.addressBreakdown.city == null
                ? item.place.addressBreakdown.province
                : item.place.addressBreakdown.city}
            </Text>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.S,
                color: CONSTANTS.COLOR.ALMOST_BLACK,
              }}>
              {item.place.formattedAddress}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {!lastItem && <View style={{borderBottomWidth: 2, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />}
    </>
  );
};
