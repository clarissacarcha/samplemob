import React from 'react';
import {View, Text} from 'react-native';
import {ThrottledOpacity} from '../../../../../../../components_section/ThrottledOpacity';
import {VectorIcon, ICON_SET} from '../../../../../../../revamp';
import {COLOR, FONT, SIZE} from '../../../../../../../res/variables';

export const StatusSection = ({delivery}) => {
  return (
    <>
      <View style={{justifyContent: 'space-evenly', marginVertical: SIZE.MARGIN}}>
        <View
          style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: SIZE.MARGIN}}>
          <View style={{flex: 1, marginLeft: 40, alignItems: 'center'}}>
            <Text style={{fontFamily: FONT.BOLD}}>Looking for rider...</Text>
          </View>
          <ThrottledOpacity
            style={{width: 40, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              console.log('OPEN SHARE LINK');
            }}>
            <VectorIcon iconSet={ICON_SET.Evil} name="share-google" size={30} color={COLOR.ORANGE} />
          </ThrottledOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginHorizontal: 50,
            alignItems: 'center',
            marginTop: SIZE.MARGIN,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <VectorIcon
              iconSet={ICON_SET.Feather}
              name="map"
              color={COLOR.YELLOW}
              size={16}
              style={{marginHorizontal: 5}}
            />
            <Text style={{color: COLOR.DARK}}>{delivery.distance} km</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <VectorIcon
              iconSet={ICON_SET.MaterialCommunity}
              name="clock-outline"
              size={16}
              color={COLOR.YELLOW}
              style={{marginHorizontal: 5}}
            />
            <Text style={{color: COLOR.DARK}}>{delivery.duration} mins</Text>
          </View>
        </View>
      </View>
      <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
    </>
  );
};
