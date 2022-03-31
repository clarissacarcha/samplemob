import React from 'react';
import {Text, View, FlatList, Image} from 'react-native';
import CONSTANTS from '../../common/res/constants';
export const LocationCard = ({item, image}) => {
  return (
    <View style={{paddingHorizontal: 20, paddingTop: 10, backgroundColor: 'white'}}>
      <View style={{flexDirection: 'row', paddingRight: image ? 20 : 0}}>
        {image && <Image source={image} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />}
        <View>
          <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, lineHeight: 16}}>{item.name}</Text>
          <Text
            style={{
              fontSize: CONSTANTS.FONT_SIZE.S,
              lineHeight: 16,
              paddingTop: 5,
              color: '#525252',
              paddingBottom: 10,
              paddingTop: 10,
            }}>
            {item.body}
          </Text>
        </View>
      </View>
      <View style={{borderBottomWidth: 2, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
    </View>
  );
};
