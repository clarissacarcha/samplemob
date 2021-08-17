import AsyncStorage from '@react-native-community/async-storage';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import {HeaderTab} from '../../../Components';
import {ToShip, ToRecieve, Completed, Cancelled} from './Components';

export const ToktokMallMyOrders = ({navigation, route}) => {

  const [userId, setUserId] = useState(0)
  const [email, setEmail] = useState('')
  const [activeTab, setActiveTab] = useState(route.params.tab || 0)

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){
        setUserId(data.userId)
        setEmail(data.email)
      }
    })
  }, [])

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      
      <HeaderTab 
        index={activeTab}
        onTabChange={(index) => {
          setActiveTab(index)
        }} 
      />

      {activeTab == 0 && <ToShip id={userId} email={email} />}

      {activeTab == 1 && <ToRecieve id={userId} email={email} />}

      {activeTab == 2 && <Completed id={userId} email={email} />}

      {activeTab == 3 && <Cancelled id={userId} email={email} />}
      
    </View>
  );
};
