import React from 'react';
import {Text, View, Image, StatusBar, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ToktokLandingDeliveries} from 'toktok/screens';
import {COLOR, FONT_SIZE} from '../../../res/variables';
import CONSTANTS from '../../../common/res/constants';
import AllActivities from '../../../ToktokGo/screens/ToktokGoActivitiesAllActivities';
import OnGoing from '../../../ToktokGo/screens/ToktokGoActivitiesOnGoing';
import Completed from '../../../ToktokGo/screens/ToktokGoActivitiesCompleted';
import Cancelled from '../../../ToktokGo/screens/ToktokGoActivitiesCancelled';
import ToktokLoadActivities from '../toktokload/ActivitiesScreen';

const ActivitiesTopTab = createMaterialTopTabNavigator();
const ToktokGoActivitiesTopTab = createMaterialTopTabNavigator();

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
      }}>
      <ActivitiesTopTab.Screen
        name="ToktokDeliveryActivities"
        component={ToktokLandingDeliveries}
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
      <ActivitiesTopTab.Screen
        name="ToktokGoActivities"
        component={ToktokGoActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
                fontSize: FONT_SIZE.M,
                color: focused ? COLOR.ORANGE : COLOR.BLACK,
                marginBottom: 5,
              }}>
              toktokgo
            </Text>
          ),
        }}
      />
      {/* <ActivitiesTopTab.Screen
        name="ToktokLoadActivities"
        component={ToktokLoadActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                // fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.Thin800,
                fontSize: FONT_SIZE.M,
                color: focused ? COLOR.ORANGE : COLOR.BLACK,
                marginBottom: 5,
              }}>
              toktokload
            </Text>
          ),
        }}
      /> */}
    </ActivitiesTopTab.Navigator>
  </>
);

export const ToktokGoActivities = () => {
  return (
    <ToktokGoActivitiesTopTab.Navigator
      tabBarOptions={{
        tabStyle: {width: 90},
        pressColor: 'transparent',
        indicatorStyle: {
          width: 0,
          height: 0,
          elevation: 0,
        },
      }}>
      <ToktokGoActivitiesTopTab.Screen
        name="AllActivities"
        component={AllActivities}
        options={{
          tabStyle: {width: 10},
          tabBarLabel: ({focused}) => (
            <View style={focused ? styles.viewFocused : styles.viewNotFocused}>
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>All</Text>
            </View>
          ),
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
          ),
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
          ),
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
          ),
        }}
      />
    </ToktokGoActivitiesTopTab.Navigator>
  );
};

export default Activities;

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
