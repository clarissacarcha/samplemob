import React from 'react';
import {StyleSheet, View, TouchableOpacity,Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import CustomIcon from '../../Components/Icons';
import { COLOR, FONT } from '../../../res/variables'; 

export const Header = ({onBack , color = "black" , label, hidden, renderRight, search = false}) => {
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
    <>
        <View style={{height: 30}}></View>
        <View style={{backgroundColor: '#fff', flexDirection: 'row',  height: 56, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 2, alignItems: 'flex-start', paddingHorizontal: 16}}>
            <Text></Text>
          </View>
          <View style={{flex: 6, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18}}>{label}</Text>
          </View>
          <View style={{flex: 2, alignItems: 'flex-end', paddingHorizontal: 16}}>
            {search && 
            <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallCategoriesList")
            }}>
              <CustomIcon.FoIcon name={"search"} color={COLOR.ORANGE} size={18}/>
            </TouchableOpacity>}
          </View>
        </View>
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
