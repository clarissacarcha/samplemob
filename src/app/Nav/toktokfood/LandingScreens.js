import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ToktokFoodHome, ToktokFoodOrders, ToktokFoodSettings} from '../../../ToktokFood/screens';

const ToktokFoodLandingBottomTab = createBottomTabNavigator();

const ToktokFoodLanding = () => (
  <ToktokFoodLandingBottomTab.Navigator>
    <ToktokFoodLandingBottomTab.Screen name="ToktokFoodHome" component={ToktokFoodHome} />
    <ToktokFoodLandingBottomTab.Screen name="ToktokFoodOrders" component={ToktokFoodOrders} />
    <ToktokFoodLandingBottomTab.Screen name="ToktokFoodSettings" component={ToktokFoodSettings} />
  </ToktokFoodLandingBottomTab.Navigator>
);

export default ({Navigator}) => (
  <Navigator.Screen options={{headerShown: false}} name="ToktokFoodLanding" component={ToktokFoodLanding} />
);
