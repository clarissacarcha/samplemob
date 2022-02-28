import React from 'react';
import {Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLOR} from 'src/res/variables';
import {
  activities_fill_ic,
  activities_ic,
  home_fill_ic,
  home_ic,
  notification_fill_ic,
  notification_ic
} from 'toktokbills/assets/icons';
import { moderateScale } from "toktokbills/helper";

import {
  ToktokBillsActivities,
  ToktokBillsHome,
  ToktokBillsNotifications
} from 'toktokbills/screens';

const ToktokLandingBottomTab = createBottomTabNavigator();

const ToktokBillsLanding = () => {
  return(
    <ToktokLandingBottomTab.Navigator>
      <ToktokLandingBottomTab.Screen
        name="ToktokBillsHome"
        component={ToktokBillsHome}
        options={{
          tabBarLabel: ({focused}) => (
            <>
              <Image
                resizeMode="contain"
                style={{height: 23, width: 25}}
                source={focused ? home_fill_ic : home_ic}
              />
              <Text style={{fontSize: 10, marginTop: 2 }}>Home</Text>
            </>
          ),
        }}
      />
      <ToktokLandingBottomTab.Screen
        name="ToktokBillsActivities"
        component={ToktokBillsActivities}
        options={{
          tabBarLabel: ({focused}) => (
            <>
              <Image
                resizeMode="contain"
                style={{height: 27, width: 27}}
                source={focused ? activities_fill_ic : activities_ic}
              />
              <Text style={{fontSize: 10, marginTop: 2 }}>Activities</Text>
            </>
          ),
        }}
      />
      <ToktokLandingBottomTab.Screen
        name="ToktokBillsNotifications"
        component={ToktokBillsNotifications}
        options={{
          tabBarLabel: ({focused}) => (
            <>
              <Image
                resizeMode="contain"
                style={{height: 25, width: 25}}
                source={focused ? notification_fill_ic : notification_ic}
              />
              <Text style={{fontSize: 10, marginTop: 2 }}>Notifications</Text>
            </>
          ),
        }}
      />
    </ToktokLandingBottomTab.Navigator>
  )
}

export default ({Navigator}) => (
  <Navigator.Screen
    name="ToktokBillsLanding"
    component={ToktokBillsLanding}
    options={{
      headerShown: false
    }}
  />
);
