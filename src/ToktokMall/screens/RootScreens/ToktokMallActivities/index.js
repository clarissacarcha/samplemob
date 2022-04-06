import AsyncStorage from '@react-native-community/async-storage';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {HeaderTab} from '../../../Components';
import {Processing, ToShip, ToRecieve, Completed, Cancelled} from './Components';
import {useFocusEffect} from '@react-navigation/native'

export const ToktokMallActivities = ({navigation, route}) => {

  const [activeTab, setActiveTab] = useState(route.params.tab || 0)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("ToktokMallLanding", {screen: "ToktokMallMyProfile"})
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  return (
    <View style={styles.container}>
      
      <HeaderTab 
        index={activeTab}
        onTabChange={(index) => {
          setActiveTab(index)
        }}
        onBack={() => {
          navigation.navigate("ToktokMallLanding", {screen: "ToktokMallMyProfile"})
        }}
      />

      {activeTab == 0 && <Processing />}

      {activeTab == 1 && <ToShip />}

      {activeTab == 2 && <ToRecieve />}

      {activeTab == 3 && <Completed />}

      {/* {activeTab == 3 && <Cancelled />} */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white'
  }
})