import React from 'react';
import {Text, View, Image, StatusBar, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ToktokLandingDeliveries} from 'toktok/screens';
import {COLOR, FONT_SIZE} from '../../../../res/variables';
import {
  ToktokBillsAllActivities,
  ToktokBillsFailedActivities,
  ToktokBillsPendingActivities,
  ToktokBillsSuccessActivities,
} from 'toktokbills/screens';

const ToktokBillsActivitiesTopTab = createMaterialTopTabNavigator();

const ToktokBillActivities = () => {
  return (
    <ToktokBillsActivitiesTopTab.Navigator
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
      <ToktokBillsActivitiesTopTab.Screen
        name="ToktokBillsAllActivities"
        component={ToktokBillsAllActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>All</Text>
            </View>
          ),
        }}
      />
      <ToktokBillsActivitiesTopTab.Screen
        name="ToktokBillsSuccessActivities"
        component={ToktokBillsSuccessActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Success</Text>
            </View>
          ),
        }}
      />
      <ToktokBillsActivitiesTopTab.Screen
        name="ToktokBillsFailedActivities"
        component={ToktokBillsFailedActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Failed</Text>
            </View>
          ),
        }}
      />
      <ToktokBillsActivitiesTopTab.Screen
        name="ToktokBillsPendingActivities"
        component={ToktokBillsPendingActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Pending</Text>
            </View>
          ),
        }}
      />
    </ToktokBillsActivitiesTopTab.Navigator>
  );
};

export default ToktokBillActivities;

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
