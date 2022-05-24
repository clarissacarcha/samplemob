import React from 'react';
import { Text, View, Image, StatusBar, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ToktokLandingDeliveries } from 'toktok/screens';
import { COLOR, FONT_SIZE } from '../../../../res/variables'
import { ToktokBillAllActivities, ToktokBillFailedActivities, ToktokBillPendingActivities, ToktokBillSuccessActivities } from 'toktokbills/screens';

const ToktokGoActivitiesTopTab = createMaterialTopTabNavigator();

const ToktokBillActivities = () => {
  return (
    <ToktokGoActivitiesTopTab.Navigator
      tabBarOptions={{
        style: { paddingHorizontal: 12},
        tabStyle: { width: 85 },
        pressColor:'transparent',
        indicatorStyle: {
          width: 0, height: 0, elevation: 0,      
        },
        scrollEnabled: true
      }
    }>
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokBillAllActivities"
        component={ToktokBillAllActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>All</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokBillSuccessActivities"
        component={ToktokBillSuccessActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Success</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokBillFailedActivities"
        component={ToktokBillFailedActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Failed</Text>
            </View>
          )
        }}
      />
      <ToktokGoActivitiesTopTab.Screen
        name="ToktokBillPendingActivities"
        component={ToktokBillPendingActivities}
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

export default ToktokBillActivities;

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