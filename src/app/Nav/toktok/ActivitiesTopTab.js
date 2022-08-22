import React from 'react';
import {Text, View, Image, StatusBar, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ToktokLandingDeliveries} from 'toktok/screens';
import {COLOR, FONT_SIZE} from '../../../res/variables';
import CONSTANTS from '../../../common/res/constants';
import AllActivities from '../../../ToktokGo/screens/ToktokGoActivitiesAllActivities';
import OnGoing from '../../../ToktokGo/screens/ToktokGoActivitiesOnGoing';
import Completed from '../../../ToktokGo/screens/ToktokGoActivitiesCompleted';
import Cancelled from '../../../ToktokGo/screens/ToktokGoActivitiesCancelled';
import ToktokLoadActivities from '../toktokload/ActivitiesScreen';
import ToktokBillActivities from '../toktokbills/ActivitiesScreen';

const ActivitiesTopTab = createMaterialTopTabNavigator();
const ToktokGoActivitiesTopTab = createMaterialTopTabNavigator();

const Activities = () => {
  constants = useSelector(state => state.constants);

  const hideGo = constants.hideGoActivities == 1 ? true : false;

  return (
    <>
      <View
        style={{
          paddingTop: StatusBar.currentHeight,
          height: Platform.select({android: 57 + StatusBar.currentHeight, ios: 50}),
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          marginBottom: 3,
        }}>
        <Text style={{paddingVertical: 14, fontSize: FONT_SIZE.XL + 3}}>Activities</Text>
      </View>
      <ActivitiesTopTab.Navigator
        swipeEnabled={false}
        tabBarOptions={{
          allowFontScaling: false,
          style: {
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          },

          indicatorStyle: {backgroundColor: COLOR.YELLOW, height: 3},

          labelStyle: {
            fontFamily: 'Rubik-Regular',
            textTransform: 'none',
            fontSize: 14,
          },
        }}>
        <ActivitiesTopTab.Screen
          name="ToktokDeliveryActivities"
          component={ToktokLandingDeliveries}
          options={() => ({
            tabBarLabel: ({focused}) => {
              return (
                <View style={{width: 100}}>
                  <Text
                    style={{
                      fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.REGULAR,
                      fontSize: FONT_SIZE.M,
                      color: focused ? COLOR.ORANGE : COLOR.BLACK,
                      marginBottom: 5,
                    }}>
                    toktokdelivery
                  </Text>
                </View>
              );
            },
          })}
        />
        {/* {!hideGo && (
          <ActivitiesTopTab.Screen
            name="ToktokGoActivities"
            component={ToktokGoActivities}
            options={() => ({
              tabBarLabel: ({focused}) => {
                return (
                  <View style={{width: 90, alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: focused ? CONSTANTS.FONT_FAMILY.BOLD : CONSTANTS.FONT_FAMILY.REGULAR,
                        fontSize: FONT_SIZE.M,
                        color: focused ? COLOR.ORANGE : COLOR.BLACK,
                        marginBottom: 5,
                      }}>
                      toktokgo
                    </Text>
                  </View>
                );
              },
            })}
          />
        )} */}
        <ActivitiesTopTab.Screen
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
                Load
              </Text>
            ),
          }}
        />
        <ActivitiesTopTab.Screen
          name="ToktokBillActivities"
          component={ToktokBillActivities}
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
      </ActivitiesTopTab.Navigator>
    </>
  );
};

export const ToktokGoActivities = () => {
  return (
    <ToktokGoActivitiesTopTab.Navigator
      tabBarOptions={{
        tabStyle: {width: 90, left: 10},
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
          tabBarLabel: ({focused}) => (
            <View style={[focused ? styles.viewFocused : styles.viewNotFocused, {marginLeft: 0}]}>
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
              <Text style={focused ? styles.textFocused : styles.textNotFocused}>Ongoing</Text>
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
