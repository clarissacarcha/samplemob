import React from 'react';
import {Text, View, Image, StatusBar} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ToktokLandingDeliveries} from 'toktok/screens';
import {ToktokGoActivities} from 'toktokgo/screens';

const ActivitiesTopTab = createMaterialTopTabNavigator();

const Activities = () => (
  <>
    <View
      style={{
        paddingTop: StatusBar.currentHeight,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{paddingVertical: 20}}>Activities</Text>
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
      <ActivitiesTopTab.Screen
        name="ToktokDeliveryActivities"
        component={ToktokLandingDeliveries}
        options={{tabBarLabel: 'toktokdelivery'}}
      />
      <ActivitiesTopTab.Screen
        name="ToktokGoActivities"
        component={ToktokGoActivities}
        options={{tabBarLabel: 'toktokgo'}}
      />
    </ActivitiesTopTab.Navigator>
  </>
);

export default Activities;
