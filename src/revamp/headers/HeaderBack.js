import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../res/constants';


export const HeaderBack = ({onBack , color = COLORS.DARK}) => {
  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      if (onBack) {
        onBack();
      } else {
        navigation.pop();
      }
    },
    1000,
    {trailing: false},
  );

  return (
    <TouchableOpacity onPress={onPress} style={{paddingHorizontal: 15,flex: 1,justifyContent:"center",alignItems:'flex-start'}}>
        <FIcon5 name="chevron-left" color={color} size={13}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
