import React from 'react';
import {Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {COLORS} from 'res/constants';

import {
  ToktokFoodHome,
  ToktokFoodFavorites,
  ToktokFoodNotifications,
  ToktokFoodOrderTransactions,
} from 'toktokfood/screens';

import {home, history, notifications, favorites} from 'toktokfood/assets/images';
import {home_fill, history_fill, notifications_fill, favorites_fill} from 'toktokfood/assets/images';

const ToktokFoodLandingBottomTab = createBottomTabNavigator();

const getOnFocusProps = (isFocus = false) => (isFocus ? COLORS.ORANGE : COLORS.DARK);

const ToktokFoodLanding = () => (
  <ToktokFoodLandingBottomTab.Navigator>
    <ToktokFoodLandingBottomTab.Screen
      name="ToktokFoodHome"
      component={ToktokFoodHome}
      options={{
        tabBarLabel: ({focused}) => (
          <>
            <Image source={focused ? home_fill : home} resizeMode="contain" style={{height: 23, width: 25}} />
            <Text style={{fontSize: 12, marginTop: 4, color: getOnFocusProps(focused)}}>Home</Text>
          </>
        ),
      }}
    />
    <ToktokFoodLandingBottomTab.Screen
      name="ToktokFoodOrderTransactions"
      component={ToktokFoodOrderTransactions}
      options={{
        tabBarLabel: ({focused}) => (
          <>
            <Image source={focused ? history_fill : history} resizeMode="contain" style={{height: 23, width: 25}} />
            <Text style={{fontSize: 12, marginTop: 4, color: getOnFocusProps(focused)}}>Activities</Text>
          </>
        ),
      }}
    />
    <ToktokFoodLandingBottomTab.Screen
      name="ToktokFoodNotifications"
      component={ToktokFoodNotifications}
      options={{
        tabBarLabel: ({focused}) => (
          <>
            <Image
              resizeMode="contain"
              style={{height: 23, width: 25}}
              source={focused ? notifications_fill : notifications}
            />
            <Text style={{fontSize: 12, marginTop: 4, color: getOnFocusProps(focused)}}>Notifications</Text>
          </>
        ),
      }}
    />
    <ToktokFoodLandingBottomTab.Screen
      name="ToktokFoodFavorites"
      component={ToktokFoodFavorites}
      options={{
        tabBarLabel: ({focused}) => (
          <>
            <Image source={focused ? favorites_fill : favorites} resizeMode="contain" style={{height: 23, width: 25}} />
            <Text style={{fontSize: 12, marginTop: 4, color: getOnFocusProps(focused)}}>Favorites</Text>
          </>
        ),
      }}
    />
  </ToktokFoodLandingBottomTab.Navigator>
);

export default ({Navigator}) => (
  <Navigator.Screen options={{headerShown: false}} name="ToktokFoodLanding" component={ToktokFoodLanding} />
);
