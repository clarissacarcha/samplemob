import React from 'react';
import {View, Text} from 'react-native';
import {ThrottledOpacity} from '../../../../../../../components_section/ThrottledOpacity';
import {VectorIcon, ICON_SET} from '../../../../../../../revamp';
import {COLOR, FONT, SIZE} from '../../../../../../../res/variables';

export const PaymentMethodSection = ({delivery}) => {
  return (
    <>
      <View style={{height: 50, justifyContent: 'space-evenly', margin: SIZE.MARGIN}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: FONT.BOLD}}>Payment Method</Text>
            <Text style={{color: COLOR.DARK}}>Cash</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: FONT.BOLD}}>Collect Payment From</Text>
            <Text style={{color: COLOR.DARK}}>Sender</Text>
          </View>
        </View>
      </View>
      <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
    </>
  );
};
