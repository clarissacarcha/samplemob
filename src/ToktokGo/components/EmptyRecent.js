import React from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import constants from '../../common/res/constants';
import EmptyImage from '../../assets/images/toktokgo-booking-start-empty.png';

export const EmptyRecent = () => {
  return (
    <>
      <View style={{alignItems: 'center', marginVertical: 53}}>
        <Image source={EmptyImage} style={{height: 199, width: 169}} resizeMode={'contain'} />
        <Text
          style={{
            marginTop: 20,
            color: constants.COLOR.ORANGE,
            fontSize: constants.FONT_SIZE.XL + 1,
            fontFamily: constants.FONT_FAMILY.BOLD,
          }}>
          No Recent Destinations
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: constants.FONT_SIZE.M,
            marginTop: 8,
            color: constants.COLOR.BLACK,
          }}>
          You don’t have recent destinations yet.
        </Text>
      </View>
    </>
  );
};
