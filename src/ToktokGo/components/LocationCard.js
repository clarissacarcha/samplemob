import React from 'react';
import {Text, View, FlatList, Image} from 'react-native';
import CONSTANTS from '../../common/res/constants';
export const LocationCard = ({item, image, lastItem = false}) => {
  return (
    <>
      <View style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row', paddingRight: image ? 20 : 0}}>
          {image && <Image source={image} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />}
          <View>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>{item.name}</Text>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.S,
                color: CONSTANTS.COLOR.ALMOST_BLACK,
              }}>
              {item.body}
            </Text>
          </View>
        </View>
      </View>
      {!lastItem && <View style={{borderBottomWidth: 2, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />}
    </>
  );
};
