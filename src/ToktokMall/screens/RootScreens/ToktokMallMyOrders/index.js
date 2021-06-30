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

      {activeTab == 0 && <ToShip data={[]} />}

      {activeTab == 1 && <ToRecieve data={[]} />}

      {activeTab == 2 && <Completed data={[]} />}

      {activeTab == 3 && <Cancelled data={[]} />}

      
      
    </View>
  );
};
