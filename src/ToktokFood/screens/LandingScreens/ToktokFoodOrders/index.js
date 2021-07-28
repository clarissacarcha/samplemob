import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export const ToktokFoodOrders = ({navigation}) => {
  return (
    <View>
      <Text>Orders</Text>
      <TouchableOpacity onPress={() => navigation.push('ToktokFoodSelectedOrder')}>
        <Text>Go To Selected Order</Text>
      </TouchableOpacity>
    </View>
  );
};
