import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {HeaderTab} from '../../../../../Components';

export const ToktokMallMyOrdersx = ({navigation, route}) => {

  const [activeTab, setActiveTab] = useState(route.params.tab || 0)

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      
      <HeaderTab 
        index={activeTab}
        onTabChange={(index) => {
          setActiveTab(index)
        }} 
      />

      {activeTab == 0 && 
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>To Ship List</Text>
      </View>}

      {activeTab == 1 && 
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>To Recieve List</Text>  
      </View>}

      {activeTab == 2 && 
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Completed List</Text>  
      </View>}

      {activeTab == 3 && 
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Cancelled List</Text>  
      </View>}

    </View>
  );
};
