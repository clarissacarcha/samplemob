import React from 'react';
import {Text, View, Image, StatusBar, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ToktokLandingDeliveries} from 'toktok/screens';
import {COLOR, FONT_SIZE} from '../../../res/variables';
import CONSTANTS from '../../../common/res/constants';
import {
  ToktokLoadAllActivities,
  ToktokLoadFailedActivities,
  ToktokLoadPendingActivities,
  ToktokLoadSuccessActivities,
} from 'toktokload/screens';

const ToktokLoadActivitiesTopTab = createMaterialTopTabNavigator();

const ToktokLoadActivities = () => {
  return (
    <ToktokLoadActivitiesTopTab.Navigator
      lazy={true}
      tabBarOptions={{
        style: {paddingHorizontal: 12},
        tabStyle: {width: 85},
        pressColor: 'transparent',
        indicatorStyle: {
          width: 0,
          height: 0,
          elevation: 0,
        },
        scrollEnabled: true,
      }}>
      <ToktokLoadActivitiesTopTab.Screen
        name="ToktokLoadAllActivities"
        component={ToktokLoadAllActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>All</Text>
            </View>
          ),
        }}
      />
      <ToktokLoadActivitiesTopTab.Screen
        name="ToktokLoadSuccessActivities"
        component={ToktokLoadSuccessActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Success</Text>
            </View>
          ),
        }}
      />
      <ToktokLoadActivitiesTopTab.Screen
        name="ToktokLoadFailedActivities"
        component={ToktokLoadFailedActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Failed</Text>
            </View>
          ),
        }}
      />
      <ToktokLoadActivitiesTopTab.Screen
        name="ToktokLoadPendingActivities"
        component={ToktokLoadPendingActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Pending</Text>
            </View>
          ),
        }}
      />
    </ToktokLoadActivitiesTopTab.Navigator>
  );
};

export default ToktokLoadActivities;

const styles = StyleSheet.create({
  viewFocused: {
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
    backgroundColor: COLOR.ORANGE,
    borderRadius: 10,
    width: 80,
  },
  viewNotFocused: {
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
    backgroundColor: COLOR.WHITE,
    borderRadius: 10,
    width: 80,
  },
  textFocused: {
    textAlign: 'center',
    fontSize: FONT_SIZE.S,
    color: COLOR.WHITE,
  },
  textNotFocused: {
    textAlign: 'center',
    fontSize: FONT_SIZE.S,
    color: COLOR.ORANGE,
  },
});
