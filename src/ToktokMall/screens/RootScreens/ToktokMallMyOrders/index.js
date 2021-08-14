import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import {HeaderTab} from '../../../Components';
import {ToShip, ToRecieve, Completed, Cancelled} from './Components';

export const ToktokMallMyOrders = ({navigation, route}) => {

  const [activeTab, setActiveTab] = useState(route.params.tab || 0)

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      
      <HeaderTab 
        index={activeTab}
        onTabChange={(index) => {
          setActiveTab(index)
        }} 
      />

      {activeTab == 0 && <ToShip id={6335} />}

      {activeTab == 1 && <ToRecieve id={6335} />}

      {activeTab == 2 && <Completed id={8008} />}

      {activeTab == 3 && <Cancelled id={8008} />}
      
    </View>
  );
};
