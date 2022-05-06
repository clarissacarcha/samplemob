import React from 'react';
import {
  ToktokMallMyProfileHome,
  ToktokMallMyFollowing,
  ToktokMallMyOrders,
  ToktokMallMyVouchers,
  ToktokMallMyWishlist,
  ToktokMallHelp,
  ToktokMallSecurity,
  ToktokMallTermsAndConditions,
  ToktokMallContactUs,
  ToktokMallActivities
} from '../../../ToktokMall/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallMyProfileHome" component={ToktokMallMyProfileHome} />
    <Navigator.Screen name="ToktokMallMyFollowing" component={ToktokMallMyFollowing} />
    <Navigator.Screen name="ToktokMallMyOrders" component={ToktokMallMyOrders} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallMyVouchers" component={ToktokMallMyVouchers} />
    <Navigator.Screen name="ToktokMallMyWishlist" component={ToktokMallMyWishlist} />
    <Navigator.Screen name="ToktokMallHelp" component={ToktokMallHelp} />
    <Navigator.Screen name="ToktokMallSecurity" component={ToktokMallSecurity} />
    <Navigator.Screen name="ToktokMallTermsAndConditions" component={ToktokMallTermsAndConditions} />
    <Navigator.Screen name="ToktokMallContactUs" component={ToktokMallContactUs} />

    <Navigator.Screen name="ToktokMallActivities" component={ToktokMallActivities} options={{headerShown: false}} />
  </>
);
