import React from 'react';
import {Text, View, Image, StatusBar} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {ToktokLandingDeliveries} from 'toktok/screens';

const ActivitiesTopTab = createMaterialTopTabNavigator();

const Activities = () => (
  <>
    <View style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white'}}>
      <Text>Activities</Text>
    </View>
    <ActivitiesTopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {width: 100},
        tabBarStyle: {marginTop: 100},
        tabBarContentContainerStyle: {
          marginTop: 100,
        },
      }}>
      <ActivitiesTopTab.Screen name="SuperAppActivitiesDelivery" component={ToktokLandingDeliveries} />
      <ActivitiesTopTab.Screen name="SuperAppActivitiesGo" component={ToktokLandingDeliveries} />
    </ActivitiesTopTab.Navigator>
  </>
);

export default Activities;
