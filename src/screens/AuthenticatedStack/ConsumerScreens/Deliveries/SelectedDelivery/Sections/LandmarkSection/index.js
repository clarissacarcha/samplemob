import React from 'react';
import {View, Text} from 'react-native';
import {ThrottledOpacity} from '../../../../../../../components_section/ThrottledOpacity';
import {VectorIcon, ICON_SET} from '../../../../../../../revamp';
import {COLOR, FONT, SIZE} from '../../../../../../../res/variables';

export const LandmarkSection = ({delivery}) => {
  if (!delivery.senderStop.landmark && !delivery.recipientStop.landmark) return null;

  return (
    <>
      <View style={{minHeight: 50, justifyContent: 'center', margin: SIZE.MARGIN}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {delivery.senderStop.landmark && (
            <View style={{flex: 1}}>
              <Text style={{fontFamily: FONT.BOLD}}>Pick Up Landmark</Text>
              <Text style={{color: COLOR.DARK}}>{delivery.senderStop.landmark}</Text>
            </View>
          )}
          {delivery.recipientStop.landmark && (
            <View style={{flex: 1}}>
              <Text style={{fontFamily: FONT.BOLD}}>Drop Off Landmark</Text>
              <Text style={{color: COLOR.DARK}}>{delivery.recipientStop.landmark}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
    </>
  );
};
