import React from 'react';
import {Text, View, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import EIcon from 'react-native-vector-icons/Entypo';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

import HomeFill from '../../../assets/images/CustomerAppBottomTabIcons/Home-fill.png'
import HomeNoFill from '../../../assets/images/CustomerAppBottomTabIcons/Home-nofill.png'
import ActivitiesFill from '../../../assets/images/CustomerAppBottomTabIcons/Activities-fill.png'
import ActivitiesNoFill from '../../../assets/images/CustomerAppBottomTabIcons/Activities-nofill.png'
import NotifFill from '../../../assets/images/CustomerAppBottomTabIcons/Notif-fill.png'
import NotifNoFill from '../../../assets/images/CustomerAppBottomTabIcons/Notif-nofill.png'
import MenuFill from '../../../assets/images/CustomerAppBottomTabIcons/Menu-fill.png'
import MenuNoFill from '../../../assets/images/CustomerAppBottomTabIcons/Menu-nofill.png'

import {COLOR, FONT_SIZE} from 'src/res/variables';

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
      activeTintColor: COLOR.ORANGE,
      inactiveTintColor: COLOR.DARK,

      labelStyle: {
        fontSize: 9,
      },

      style: {
        paddingVertical: 10, 
        height: 55}
    }}>
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingHome"
      component={ToktokLandingHome}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: COLOR.BLACK, marginBottom: 5 }}>Home</Text>
        ),
        tabBarIcon: ({color}) => <Image source={color == COLOR.ORANGE? HomeFill : HomeNoFill} resizeMode={'contain'} style={{height: 25, width: 25}} />,
      }}
    />
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingDeliveries"
      component={ToktokLandingDeliveries}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: COLOR.BLACK, marginBottom: 5 }}>Activities</Text>
        ),
        tabBarIcon: ({color}) => <Image source={color == COLOR.ORANGE? ActivitiesFill : ActivitiesNoFill} resizeMode={'contain'} style={{height: 25, width: 25}} />,
      }}
    />
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingNotifications"
      component={ToktokLandingNotifications}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: COLOR.BLACK, marginBottom: 5 }}>Notification</Text>
        ),
        tabBarIcon: ({color}) => <Image source={color == COLOR.ORANGE? NotifFill : NotifNoFill} resizeMode={'contain'} style={{height: 25, width: 25}} />,
      }}
    />
    <ToktokLandingBottomTab.Screen
      name="ToktokLandingMenu"
      component={ToktokLandingMenu}
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{fontSize: 10, color: COLOR.BLACK, marginBottom: 5 }}>Menu</Text>
        ),
        tabBarIcon: ({color}) => <Image source={color == COLOR.ORANGE? MenuFill : MenuNoFill} resizeMode={'contain'} style={{height: 25, width: 25}} />,
      }}
    />
  </ToktokLandingBottomTab.Navigator>
);

export default ({Navigator}) => (
  <Navigator.Screen name="ConsumerLanding" component={ToktokLanding} options={{headerShown: false}} />
);
