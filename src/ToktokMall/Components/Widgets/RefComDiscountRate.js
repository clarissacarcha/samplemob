import React from 'react';
import {
  View,
  Text,
} from 'react-native';

export const RefComDiscountRate = ({value, w = '50%'}) => {
  return (
    <>
      <View style={{width: w, marginTop: 5}}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: '700',
            backgroundColor: '#FDBA1C',
            borderRadius: 3,
            textAlign: 'center',
            marginBottom: -16,
            marginLeft: -3,
            marginRight: 3,
          }}
        />
        <Text
          style={{
            fontSize: 9,
            fontWeight: '700',
            color: '#fff',
            backgroundColor: '#FF0F00',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 3,
            textAlign: 'center',
          }}>
          {value}
        </Text>
      </View>
    </>
  );
};
