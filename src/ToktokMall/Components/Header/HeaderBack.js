import React from 'react';
import {StyleSheet, View, TouchableOpacity,Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { COLOR, FONT } from '../../../res/variables'; 


export const HeaderBack = ({onBack , color = "black" , label, hidden}) => {
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
    <TouchableOpacity onPress={!hidden && onPress} style={{paddingHorizontal: 15,flex: 0,justifyContent:"flex-start",alignItems:'center',flexDirection:"row"}}>
        {!hidden && <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>}
        <Text style={{fontFamily: FONT.BOLD,fontSize: 14,marginLeft: 5}}>{label}</Text>
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
