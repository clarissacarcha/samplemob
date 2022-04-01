import React from 'react';
import { Text, View, Image, StatusBar, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ToktokLandingDeliveries } from 'toktok/screens';
import { COLOR, FONT_SIZE } from '../../../res/variables'
import CONSTANTS from '../../../common/res/constants'
import { ToktokLoadAllActivities, ToktokLoadFailedActivities, ToktokLoadPendingActivities, ToktokLoadSuccessActivities } from 'toktokload/screens';

const ToktokGoActivitiesTopTab = createMaterialTopTabNavigator();

const ToktokLoadActivities = () => {
  return (
    <ToktokGoActivitiesTopTab.Navigator
      tabBarOptions={{
        style: { paddingHorizontal: 12 },
        tabStyle: { width: 90 },
        pressColor:'transparent',
        indicatorStyle: {
          width: 0, height: 0, elevation: 0,      
        },
        scrollEnabled: true
      }
    }>
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokLoadAllActivities"
        component={ToktokLoadAllActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>All</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokLoadSuccessActivities"
        component={ToktokLoadSuccessActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Success</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokLoadFailedActivities"
        component={ToktokLoadFailedActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Failed</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokLoadPendingActivities"
        component={ToktokLoadPendingActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Pending</Text>
            </View>
          )
        }}
      />
    </ToktokGoActivitiesTopTab.Navigator>
  );
};

export default ToktokLoadActivities;

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