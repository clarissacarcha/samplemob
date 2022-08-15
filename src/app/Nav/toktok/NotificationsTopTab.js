import React from 'react';
import {Text, View, Image, StatusBar, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {COLOR, FONT_SIZE} from '../../../res/variables';
import CONSTANTS from '../../../common/res/constants';
import {ToktokLandingNotifications} from 'toktok/screens';
import {ToktokLoadNotifications} from 'toktokload/screens';
import {ToktokBillsNotifications} from 'toktokbills/screens';

const NotificationsTopTab = createMaterialTopTabNavigator();

const Notifications = () => (
  <>
    <View
      style={{
        paddingTop: StatusBar.currentHeight,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{paddingVertical: 20}}>Notifications</Text>
    </View>
    <NotificationsTopTab.Navigator
      tabBarOptions={{
        indicatorStyle: {backgroundColor: COLOR.YELLOW},
      }}>
      <NotificationsTopTab.Screen
        name="ToktokLandingNotifications"
        component={ToktokLandingNotifications}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
                fontSize: FONT_SIZE.M,
                color: focused ? COLOR.ORANGE : COLOR.BLACK,
                marginBottom: 5,
              }}>
              toktokdelivery
            </Text>
          ),
        }}
      />
      <NotificationsTopTab.Screen
        name="ToktokLoadNotifications"
        component={ToktokLoadNotifications}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
                fontSize: FONT_SIZE.M,
                color: focused ? COLOR.ORANGE : COLOR.BLACK,
                marginBottom: 5,
              }}>
              Load
            </Text>
          ),
        }}
      />
      <NotificationsTopTab.Screen
        name="ToktokBillsNotifications"
        component={ToktokBillsNotifications}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
                fontSize: FONT_SIZE.M,
                color: focused ? COLOR.ORANGE : COLOR.BLACK,
                marginBottom: 5,
              }}>
              Bills
            </Text>
          ),
        }}
      />
    </NotificationsTopTab.Navigator>
  </>
);

export default Notifications;

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
