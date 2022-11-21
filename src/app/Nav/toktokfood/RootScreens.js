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
  ToktokFoodShopOverview,
  ToktokRiderRating,
  ToktokFoodTermsAndConditions,
  ToktokFoodPrivacyPolicy,
  ToktokFoodContactUs,
  ToktokFoodEmptyCart,
  ToktokFoodOrder,
  ToktokFoodPlaceOrder,
  ToktokFoodActivities,
  ToktokFoodNotifications,
  ToktokFoodHomeSearch,
} from 'toktokfood/screens';
import ToktokFoodHomeScreen from 'toktokfood/screens/RootScreens/ToktokFoodHomeScreen';
import ToktokFoodHomePromotionScreen from 'toktokfood/screens/RootScreens/ToktokFoodHomePromotionScreen';

export default ({Navigator}) => (
  <>
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodNotif" component={ToktokFoodNotifications} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodCart" component={ToktokFoodCart} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodDriver" component={ToktokFoodDriver} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodOrder" component={ToktokFoodOrder} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodPlaceOrder" component={ToktokFoodPlaceOrder} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodActivities" component={ToktokFoodActivities} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodSearch" component={ToktokFoodSearch} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodHomeSearch" component={ToktokFoodHomeSearch} />
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
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodShopOverview" component={ToktokFoodShopOverview} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodHomeScreen" component={ToktokFoodHomeScreen} />
    <Navigator.Screen options={{headerShown: false}} name="ToktokFoodHomePromotionScreen" component={ToktokFoodHomePromotionScreen} />
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
