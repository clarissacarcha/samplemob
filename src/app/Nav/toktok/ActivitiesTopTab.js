import React from 'react';
import {Text, View, Image, StatusBar} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ToktokLandingDeliveries} from 'toktok/screens';
import {ToktokGoActivities} from 'toktokgo/screens';
import {COLOR, FONT_SIZE} from '../../../res/variables'
import CONSTANTS from '../../../common/res/constants'

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
      tabBarOptions={{
        indicatorStyle: {backgroundColor: COLOR.YELLOW},
      }}
      >
      <ActivitiesTopTab.Screen
        name="ToktokDeliveryActivities"
        component={ToktokLandingDeliveries}
        options={{
          tabBarLabel: ({focused}) => 
          <Text style={{
            // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
            fontSize: FONT_SIZE.M, 
            color: focused ? COLOR.ORANGE : COLOR.BLACK, 
            marginBottom: 5}}>toktokdelivery</Text>
        }}
      />
      <ActivitiesTopTab.Screen
        name="ToktokGoActivities"
        component={ToktokGoActivities}
        options={{
          tabBarLabel: ({focused}) => 
          <Text style={{
            // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
            fontSize: FONT_SIZE.M,
            color: focused ? COLOR.ORANGE : COLOR.BLACK, 
            marginBottom: 5}}>toktokgo</Text>
        }}
      />
    </ActivitiesTopTab.Navigator>
  </>
);

export default Activities;
