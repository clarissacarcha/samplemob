import React from 'react';

import {
  ToktokFoodCart,
  ToktokFoodDriver,
  ToktokFoodSearch,
  ToktokFoodMapSearch,
  ToktokFoodCategories,
  ToktokFoodItemDetails,
  TokTokFoodSplashScreen,
  ToktokFoodOrderDetails,
  ToktokFoodAddressDetails,
  ToktokFoodRestaurantOverview,
  ToktokRiderRating,
} from 'toktokfood/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodCart" component={ToktokFoodCart} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodDriver" component={ToktokFoodDriver} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodSearch" component={ToktokFoodSearch} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokRiderRating" component={ToktokRiderRating} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodMapSearch" component={ToktokFoodMapSearch} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodCategories" component={ToktokFoodCategories} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodItemDetails" component={ToktokFoodItemDetails} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodOrderDetails" component={ToktokFoodOrderDetails} />
    <Navigator.Screen options={{headerShown: false}} name="TokTokFoodSplashScreen" component={TokTokFoodSplashScreen} />
    <Navigator.Screen
      options={{headerShown: false}}
      name="ToktokFoodRestaurantOverview"
      component={ToktokFoodRestaurantOverview}
    />
    <Navigator.Screen
      options={{headerShown: false}}
      name="ToktokFoodAddressDetails"
      component={ToktokFoodAddressDetails}
    />
  </>
);
