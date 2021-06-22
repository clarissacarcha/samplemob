import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ToktokFoodHome,
  ToktokFoodOrders,
  ToktokFoodSettings,
  ToktokFoodRestaurantOverview,
} from '../../../ToktokFood/screens';

const ToktokFoodLandingBottomTab = createBottomTabNavigator();

const ToktokStack = createStackNavigator();

const ToktokFoodHomeStack = () => (
  <ToktokStack.Navigator screenOptions={{headerShown: false}} initialRouteName="ToktokFoodHome">
    <ToktokStack.Screen name="ToktokFoodHome" component={ToktokFoodHome} />
    <ToktokStack.Screen name="ToktokFoodRestaurantOverview" component={ToktokFoodRestaurantOverview} />
  </ToktokStack.Navigator>
);

const ToktokFoodLanding = () => (
  <ToktokFoodLandingBottomTab.Navigator>
    <ToktokFoodLandingBottomTab.Screen name="ToktokFoodHome" component={ToktokFoodHomeStack} />
    <ToktokFoodLandingBottomTab.Screen name="ToktokFoodOrders" component={ToktokFoodOrders} />
    <ToktokFoodLandingBottomTab.Screen name="ToktokFoodSettings" component={ToktokFoodSettings} />
  </ToktokFoodLandingBottomTab.Navigator>
);

export default ({Navigator}) => (
  <Navigator.Screen options={{headerShown: false}} name="ToktokFoodLanding" component={ToktokFoodLanding} />
);
