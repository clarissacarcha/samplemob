import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import {Renderer} from './Components';

export const ToktokMallOrderDetails = ({navigation, route}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Order Details', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  useEffect(() => {
    console.log(route.params.id)
  }, [])
  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
    
			<Renderer id={route.params.id} />
      
    </View>
  );
};
