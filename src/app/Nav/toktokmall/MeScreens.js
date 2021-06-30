import React from 'react';
import {
  ToktokMallMyProfileHome,
  ToktokMallMyFollowing,
  ToktokMallMyOrders,
  ToktokMallMyVouchers,
  ToktokMallMyWishlist
} from '../../../ToktokMall/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallMyProfileHome" component={ToktokMallMyProfileHome} />
    <Navigator.Screen name="ToktokMallMyFollowing" component={ToktokMallMyFollowing} />
    <Navigator.Screen name="ToktokMallMyOrders" component={ToktokMallMyOrders} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallMyVouchers" component={ToktokMallMyVouchers} />
    <Navigator.Screen name="ToktokMallMyWishlist" component={ToktokMallMyWishlist} />
  </>
);
