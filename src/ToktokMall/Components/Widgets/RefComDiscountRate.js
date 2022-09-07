import React from 'react';
import {
  View,
  Text,
  Platform,
  Dimensions
} from 'react-native';

export const RefComDiscountRate = ({value, w = '50%'}) => {
  if(value === "Reseller - 0%") return null;
  
  return (
    <>
      <View style={{width: w, marginTop: 5}}>
        <Text
          style={{
            height: 16,
            fontSize: 9,
            fontWeight: '700',
            backgroundColor: '#FDBA1C',
            borderRadius: 1,
            textAlign: 'center',
            marginBottom: -18,
            marginLeft: -3,
            marginRight: 3,
          }}
        />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            height: 16,
            fontSize: 9,
            fontWeight: '700',
            color: '#fff',
            backgroundColor: '#F6382D',
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRadius: 1,
            textAlign: 'center',
          }}>
          {value}
        </Text>
      </View>
    </>
  );  

};
