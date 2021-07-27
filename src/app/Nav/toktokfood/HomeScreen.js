import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  ToktokFoodCart,
  ToktokFoodHome,
  ToktokFoodCategories,
  ToktokFoodSearch,
  ToktokFoodDriver,
  ToktokFoodItemDetails,
  ToktokFoodOrderDetails,
  ToktokFoodRestaurantOverview,
} from 'toktokfood/screens';

const ToktokStack = createStackNavigator();

const HomeScreen = () => (
  <ToktokStack.Navigator screenOptions={{headerShown: false}} initialRouteName="ToktokFoodHome">
    <ToktokStack.Screen name="ToktokFoodSearch" component={ToktokFoodSearch} />
    <ToktokStack.Screen name="ToktokFoodCart" component={ToktokFoodCart} />
    <ToktokStack.Screen name="ToktokFoodHome" component={ToktokFoodHome} />
    <ToktokStack.Screen name="ToktokFoodCategories" component={ToktokFoodCategories} />
    <ToktokStack.Screen name="ToktokFoodRestaurantOverview" component={ToktokFoodRestaurantOverview} />
    <ToktokStack.Screen name="ToktokFoodItemDetails" component={ToktokFoodItemDetails} />
    <ToktokStack.Screen name="ToktokFoodOrderDetails" component={ToktokFoodOrderDetails} />
    <ToktokStack.Screen name="ToktokFoodDriver" component={ToktokFoodDriver} />
  </ToktokStack.Navigator>
);

export default HomeScreen;
