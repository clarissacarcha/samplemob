import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

import {COLOR} from 'src/res/variables';

import {
  ToktokLandingHome,
  ToktokLandingDeliveries,
  ToktokLandingNotifications,
  ToktokLandingMenu,
} from 'toktok/screens';

const ToktokLandingBottomTab = createBottomTabNavigator();

const ToktokLanding = () => (
  <ToktokLandingBottomTab.Navigator
    tabBarOptions={{
      activeTintColor: COLOR.YELLOW,
      inactiveTintColor: COLOR.MEDIUM,

      labelStyle: {
        fontSize: 9,
      },
    }}>
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingHome"
      component={ToktokLandingHome}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Home</Text>
        ),
        tabBarIcon: ({color}) => <MCIcon name="home" color={color} size={30} />,
      }}
    />
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingDeliveries"
      component={ToktokLandingDeliveries}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Deliveries</Text>
        ),
        tabBarIcon: ({color}) => <FA5Icon name="clipboard-list" color={color} size={26} />,
      }}
    />
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingNotifications"
      component={ToktokLandingNotifications}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Notifications</Text>
        ),
        tabBarIcon: ({color}) => <MIcon name="notifications" color={color} size={26} />,
      }}
    />
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingMenu"
      component={ToktokLandingMenu}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: focused ? COLOR.BLACK : COLOR.MEDIUM}}>Menu</Text>
        ),
        tabBarIcon: ({color}) => <EIcon name="menu" color={color} size={30} />,
      }}
    />
  </ToktokLandingBottomTab.Navigator>
);

export default ({Navigator}) => (
  <Navigator.Screen name="ConsumerLanding" component={ToktokLanding} options={{headerShown: false}} />
);
