import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import {Renderer} from './Components';
import { ApiCall } from '../../../helpers';

import {EventRegister} from 'react-native-event-listeners'

export const ToktokMallOrderDetails = ({navigation, route}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={() => {
      EventRegister.emit('refreshToktokmallNotifications')
      navigation.pop()
    }} />,
    headerTitle: () => <HeaderTitle label={['Order Details', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  const readNotification = async (payload) => {
    const req = await ApiCall(`read_notification`, payload, true)
    if(req.responseData && req.responseData.success){
      console.log("read notification success")
    }
  }

  useEffect(() => {
    // console.log(route.params)
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){
        if(route.params.notificationId){
          readNotification({id: route.params.notificationId, userid: data.userId})
        }
      }
    })
  }, [])
  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
    
			<Renderer id={route.params.id} />
      
    </View>
  );
};
