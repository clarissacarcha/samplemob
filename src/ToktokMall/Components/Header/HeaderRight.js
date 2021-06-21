import React from 'react';
import {StyleSheet, View, TouchableOpacity,Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { COLOR, FONT } from '../../../res/variables'; 


export const HeaderRight = ({ color = "black" , label, hidden, icon, onPress}) => {
  const navigation = useNavigation();

  const onButtonPress = throttle(
    () => {
      if (onPress) {
        onPress();
      } else {
        navigation.pop();
      }
    },
    1000,
    {trailing: false},
  );

  return (
    <TouchableOpacity onPress={!hidden && onButtonPress} style={{paddingHorizontal: 15,flex: 0,justifyContent:"flex-start",alignItems:'center',flexDirection:"row"}}>
        {!hidden && icon ? <FIcon5 name={icon} color={COLOR.ORANGE} size={13}/> : null}
        <Text style={{fontFamily: FONT.REGULAR,fontSize: 14,marginLeft: 5, color: COLOR.ORANGE}}>{label}</Text>
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
