import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {HeaderTab} from '../../../../../Components';

export const ToktokMallMyOrdersx = ({navigation, route}) => {

  const [activeTab, setActiveTab] = useState(route.params.tab || 0)

  return (
    <View style={styles.container}>
      
      <HeaderTab 
        index={activeTab}
        onTabChange={(index) => {
          setActiveTab(index)
        }} 
      />

      {activeTab == 0 && 
      <View style={styles.tabStyle}>
        <Text>To Ship List</Text>
      </View>}

      {activeTab == 1 && 
      <View style={styles.tabStyle}>
        <Text>To Recieve List</Text>  
      </View>}

      {activeTab == 2 && 
      <View style={styles.tabStyle}>
        <Text>Completed List</Text>  
      </View>}

      {activeTab == 3 && 
      <View style={styles.tabStyle}>
        <Text>Cancelled List</Text>  
      </View>}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white'
  },
  tabStyle: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
})
