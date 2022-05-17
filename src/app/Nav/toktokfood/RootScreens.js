import React from 'react';

import {
  ToktokFoodCart,
  ToktokFoodDriver,
  ToktokFoodSearch,
  ToktokFoodMapSearch,
  ToktokFoodCategories,
  ToktokFoodCategoriesScreen,
  ToktokFoodShopCategories,
  ToktokFoodItemDetails,
  TokTokFoodSplashScreen,
  ToktokFoodOrderDetails,
  ToktokFoodAddressDetails,
  ToktokFoodRestaurantOverview,
  ToktokRiderRating,
  ToktokFoodTermsAndConditions,
  ToktokFoodPrivacyPolicy,
  ToktokFoodContactUs,
  ToktokFoodEmptyCart,
} from 'toktokfood/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodCart" component={ToktokFoodCart} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodDriver" component={ToktokFoodDriver} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodSearch" component={ToktokFoodSearch} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokRiderRating" component={ToktokRiderRating} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodMapSearch" component={ToktokFoodMapSearch} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodCategories" component={ToktokFoodCategories} />
    <Navigator.Screen
      options={{headerShown: false}}
      name="ToktokFoodCategoriesScreen"
      component={ToktokFoodCategoriesScreen}
    />
    <Navigator.Screen
      options={{headerShown: false}}
      name="ToktokFoodShopCategories"
      component={ToktokFoodShopCategories}
    />
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
    <Navigator.Screen
      options={{headerShown: false}}
      name="ToktokFoodTermsAndConditions"
      component={ToktokFoodTermsAndConditions}
    />
    <Navigator.Screen
      options={{headerShown: false}}
      name="ToktokFoodPrivacyPolicy"
      component={ToktokFoodPrivacyPolicy}
    />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodContactUs" component={ToktokFoodContactUs} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodEmptyCart" component={ToktokFoodEmptyCart} />
  </>
);
