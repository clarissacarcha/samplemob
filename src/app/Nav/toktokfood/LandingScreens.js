import React from 'react';
import {Text} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {COLOR} from 'res/variables';

import HomeScreen from './HomeScreen';
import {ToktokFoodFavorites, ToktokFoodNotifications, ToktokFoodOrderTransactions} from '../../../ToktokFood/screens';

const ToktokFoodLandingBottomTab = createBottomTabNavigator();

const getOnFocusProps = (isFocus = false) => (isFocus ? COLOR.YELLOW : COLOR.DARK);

const ToktokFoodLanding = () => (
  <ToktokFoodLandingBottomTab.Navigator>
    <ToktokFoodLandingBottomTab.Screen
      name="ToktokFoodHome"
      component={HomeScreen}
      options={{
        tabBarLabel: ({focused}) => (
          <>
            <FA5Icon name="utensils" color={getOnFocusProps(focused)} size={20} />
            <Text style={{fontSize: 10, marginTop: 4, color: getOnFocusProps(focused)}}>Home</Text>
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
            <FA5Icon name="history" color={getOnFocusProps(focused)} size={20} />
            <Text style={{fontSize: 10, marginTop: 4, color: getOnFocusProps(focused)}}>Activities</Text>
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
            <MIcon name="notifications" color={getOnFocusProps(focused)} size={25} />
            <Text style={{fontSize: 10, marginTop: 4, color: getOnFocusProps(focused)}}>Notifications</Text>
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
            <FA5Icon name="heart" color={getOnFocusProps(focused)} size={20} />
            <Text style={{fontSize: 10, marginTop: 4, color: getOnFocusProps(focused)}}>Favorites</Text>
          </>
        ),
      }}
    />
  </ToktokFoodLandingBottomTab.Navigator>
);

export default ({Navigator}) => (
  <Navigator.Screen options={{headerShown: false}} name="ToktokFoodLanding" component={ToktokFoodLanding} />
);
