import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  ToktokFoodHome,
  ToktokFoodSearch,
  ToktokFoodRestaurantOverview,
  ToktokFoodDriver,
  ToktokFoodOrderDetails,
} from 'toktokfood/screens';

const ToktokStack = createStackNavigator();

const HomeScreen = () => (
  <ToktokStack.Navigator screenOptions={{headerShown: false}} initialRouteName="ToktokFoodHome">
    <ToktokStack.Screen name="ToktokFoodSearch" component={ToktokFoodSearch} />
    <ToktokStack.Screen name="ToktokFoodHome" component={ToktokFoodHome} />
    <ToktokStack.Screen name="ToktokFoodRestaurantOverview" component={ToktokFoodRestaurantOverview} />
    <ToktokStack.Screen name="ToktokFoodDriver" component={ToktokFoodDriver} />
    <ToktokStack.Screen name="ToktokFoodOrderDetails" component={ToktokFoodOrderDetails} />
  </ToktokStack.Navigator>
);

export default HomeScreen;
