import React from 'react';
import {Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {COLOR} from 'res/variables';

import {
  ToktokFoodHome,
  ToktokFoodOrders,
  ToktokFoodSearch,
  ToktokFoodFavorites,
  ToktokFoodNotifications,
  ToktokFoodRestaurantOverview,
} from '../../../ToktokFood/screens';

const ToktokStack = createStackNavigator();
const ToktokFoodLandingBottomTab = createBottomTabNavigator();

const getOnFocusProps = (isFocus = false) => (isFocus ? COLOR.YELLOW : COLOR.DARK);

const ToktokFoodHomeStack = () => (
  <ToktokStack.Navigator screenOptions={{headerShown: false}} initialRouteName="ToktokFoodHome">
    <ToktokStack.Screen name="ToktokFoodSearch" component={ToktokFoodSearch} />
    <ToktokStack.Screen name="ToktokFoodHome" component={ToktokFoodHome} />
    <ToktokStack.Screen name="ToktokFoodRestaurantOverview" component={ToktokFoodRestaurantOverview} />
  </ToktokStack.Navigator>
);

const ToktokFoodLanding = () => (
  <ToktokFoodLandingBottomTab.Navigator>
    <ToktokFoodLandingBottomTab.Screen
      name="ToktokFoodHome"
      component={ToktokFoodHomeStack}
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
      name="ToktokFoodOrders"
      component={ToktokFoodOrders}
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
