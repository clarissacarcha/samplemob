import React from 'react';
import {StyleSheet, View, TouchableOpacity,Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import CustomIcon from '../Icons';
import { COLOR, FONT } from '../../../res/variables'; 

export const HeaderRight = ({ color = "black" , label, hidden, icon, iconSize, onPress}) => {
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
    <>
    {hidden && <View style={{flex: 0, paddingHorizontal: 15}} />}
    {!hidden && 
      <TouchableOpacity onPress={onButtonPress} style={{paddingHorizontal: 15,flex: 0,justifyContent:"flex-start",alignItems:'center',flexDirection:"row"}}>
        {icon ? <CustomIcon.FoIcon name={icon} color={COLOR.ORANGE} size={iconSize}/> : null}
        <Text style={{fontFamily: FONT.REGULAR,fontSize: 14,marginLeft: 5, color: COLOR.ORANGE}}>{label}</Text>
      </TouchableOpacity>}
    </>
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
