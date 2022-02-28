import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import HomeFill from '../../../assets/images/CustomerAppBottomTabIcons/Home-fill.png'
import CONSTANTS from '../../../common/res/constants'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { COLOR, FONT_SIZE } from '../../../res/variables'

import AllActivities from './AllActivities';
import Completed from './Completed'
import OnGoing from './OnGoing';
import Cancelled from './Cancelled';

const ToktokGoActivitiesTopTab = createMaterialTopTabNavigator();

export const ToktokGoActivities = () => {
  return (
    <ToktokGoActivitiesTopTab.Navigator
    tabBarOptions={{
      tabStyle: { width: 90 },
      pressColor:'transparent',
      indicatorStyle: {
        width: 0, height: 0, elevation: 0,      
      },
    }
    
    }>
      <ToktokGoActivitiesTopTab.Screen
        name="AllActivities"
        component={AllActivities}
        options={{
          tabStyle: {width: 10},
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>All</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="OnGoing"
        component={OnGoing}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>OnGoing</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="Completed"
        component={Completed}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
             <Text style={focused ? styles.textFocused : styles.textNotFocused}>Completed</Text>
           </View>
         )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="Cancelled"
        component={Cancelled}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
             <Text style={focused ? styles.textFocused : styles.textNotFocused}>Cancelled</Text>
           </View>
         )
        }}
      />
    </ToktokGoActivitiesTopTab.Navigator>
  );
};

export const OnGoingActivities = () => {
  return (
    <View style={{backgroundColor: 'red', width: '100%', height: '100%'}}>
      <Text>OnGoing Activities</Text>
    </View>
  );
};

export const CompletedActivities = () => {
  return (
    <View style={{backgroundColor: 'green', width: '100%', height: '100%'}}>
      <Text>Completed Activities</Text>
    </View>  
  );
};

export const CancelledActivities = () => {
  return (
    <View style={{backgroundColor: 'blue', width: '100%', height: '100%'}}>
      <Text>Cancelled Activities</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewFocused: {
    borderWidth: 1, 
    borderColor: COLOR.ORANGE, 
    backgroundColor: COLOR.ORANGE, 
    borderRadius: 10, 
    width: 80
  }, 
  viewNotFocused: {
    borderWidth: 1, 
    borderColor: COLOR.ORANGE,
    backgroundColor: COLOR.WHITE, 
    borderRadius: 10, 
    width: 80
  },
  textFocused: { 
    textAlign:'center',
    fontSize: FONT_SIZE.S, 
    color: COLOR.WHITE,
  },
  textNotFocused: { 
    textAlign:'center',
    fontSize: FONT_SIZE.S, 
    color: COLOR.ORANGE,
  }
});