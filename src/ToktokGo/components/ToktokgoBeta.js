import React from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import BetaImage from '../../assets/images/BetaImages.png';
import constants from '../../common/res/constants';
export const ToktokgoBeta = ({item, onPress, onSelectPlace, lastItem = false}) => {
  return (
    <>
      <View style={{alignItems: 'center', marginVertical: 53}}>
        <Image source={BetaImage} style={{height: 250, width: 257}} resizeMode={'contain'} />
        <Text
          style={{
            marginTop: 20,
            color: constants.COLOR.YELLOW,
            fontSize: constants.FONT_SIZE.XL + 1,
            fontFamily: constants.FONT_FAMILY.BOLD,
          }}>
          toktok
          <Text
            style={{
              fontFamily: constants.FONT_FAMILY.BOLD,
              color: constants.COLOR.ORANGE,
              fontSize: constants.FONT_SIZE.XL + 1,
            }}>
            go Beta 1.0
          </Text>
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: constants.FONT_SIZE.S - 1,
            marginTop: 8,
            marginHorizontal: 51,
            color: constants.COLOR.DARK,
          }}>
          This is first beta version of toktokgo service. This beta is work in progress and we'd like to encourage users
          to share their impressions as we gear up to a new level.
        </Text>
      </View>
    </>
  );
};
